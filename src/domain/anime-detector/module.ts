import { DiscordMessage, DiscordMessageAttachment } from '../../discord/types';
import { LoggingService } from '../../utils/logging';
import { BotAction, BotActionType } from '../action-types';
import { AnimeDetectorModule, ModuleType } from '../module-types';
import { AnimeDetectorEmitter } from './metrics';
import { AnimeDetectorService } from './detector-service';
import { ImageUploaderService } from './upload-image-service';

export const animeDetectorModule = (
  { log }: LoggingService,
  emitter: AnimeDetectorEmitter,
  detectAnime: AnimeDetectorService,
  uploadImage: ImageUploaderService,
): AnimeDetectorModule => {

  const backupImage = async (url: string) => {
    try {
      return await uploadImage(url);
    } catch (error) {
      log(`warning`, `Failed to backup image`, { title: `Image Backup Failed`, image: url, data: { url, error: String(error) } });
      return undefined;
    }
  };

  const onMessage = async (message: DiscordMessage): Promise<BotAction[]> => {
    for (const url of parseAllUrls(message)) {
      const res = await detectAnime(url);
      const { verdict, keywordCounts } = res;
      emitter.imageScanned(message.author.tag ?? `UNKNOWN`, verdict);
    
      if (verdict) {
        const backedUpImageUrl = await backupImage(url);
        log(`notice`, `Message removed`, { title: `Anime Purged`, image: backedUpImageUrl ?? url, data: { user: message.author.tag, keywords: keywordCounts, originalImageUrl: url, backedUpImageUrl } });
        return [{ type: BotActionType.RemoveMessage, channelId: message.channel.id, messageId: message.id }];
      }
    }
    return [];
  };
  
  return { type: ModuleType.AnimeDetector, onMessage };
};

const PATTERN_GENERIC_IMAGE = /\w*?(https?:\/\/[^ ]+?\.(jpg|jpeg|png|tif|bmp|gif|webp))\w*?/gi;
const PATTERN_IMGUR = /\w*?https?:\/\/(i.)?imgur\.com\/(?<id>[^. ]+)\w*?/gi;

const parseAllUrls = (message: DiscordMessage): string[] => Array.from(new Set([...parseAttachmentUrls(message.attachments), ...parseContentUrls(message.content)]));
const parseContentUrls = (message: string): string[] => [...parsePlainImageUrls(message), ...parseImgurUrls(message)];
const parseAttachmentUrls = (attachments: DiscordMessageAttachment[]): string[] => attachments.filter(({ width }) => width !== undefined).map(({ url }) => url);
const parsePlainImageUrls = (message: string): string[] => Array.from(message.matchAll(PATTERN_GENERIC_IMAGE)).map(match => match[0]);
const parseImgurUrls = (message: string): string[] =>
  Array.from(message.matchAll(PATTERN_IMGUR))
    .map(match => match.groups?.id)
    .map(id => `https://i.imgur.com/${id}.png`); // we can use any file extension
