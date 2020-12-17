import { DiscordMessage, DiscordMessageAttachment } from '../../discord-service/types';
import { LoggingService } from '../../utils/logging';
import { BotActionType } from '../action-types';
import { AnimeDetectorModule, ModuleType } from '../module-types';
import { animeDetectorEmitter } from './metrics';
import { animeDetectorService } from './service';

const patternAnyImageUrl = /\w*?(https?:\/\/[^ ]+?\.(jpg|jpeg|png|tif|bmp|gif|webp))\w*?/gi;
const patternImgurId = /\w*?https?:\/\/(i.)?imgur\.com\/(?<id>[^. ]+)\w*?/gi;

export interface AnimeDetectorConfig {
  keywords: string[];
  keywordCountThreshold: number;
}

const parseAllUrls = (message: DiscordMessage): string[] => Array.from(new Set([...parseAttachmentUrls(message.attachments), ...parseContentUrls(message.content)]));
const parseContentUrls = (message: string): string[] => [...parsePlainImageUrls(message), ...parseImgurUrls(message)];
const parseAttachmentUrls = (attachments: DiscordMessageAttachment[]): string[] => attachments.filter(({ width }) => width !== null).map(({ url }) => url);
const parsePlainImageUrls = (message: string): string[] => Array.from(message.matchAll(patternAnyImageUrl)).map(match => match[0]);
const parseImgurUrls = (message: string): string[] =>
  Array.from(message.matchAll(patternImgurId))
    .map(match => match.groups?.id)
    .map(id => `https://i.imgur.com/${id}.png`); // we can use any file extension

export const animeDetectorModule = (config: AnimeDetectorConfig, logger: LoggingService): AnimeDetectorModule => {
  const emit = animeDetectorEmitter();
  return {
    type: ModuleType.AnimeDetector,
    onMessage: async (message: DiscordMessage) => {
      const detectAnime = animeDetectorService(config, logger);
      for (const url of parseAllUrls(message)) {
        const [verdict, counts] = await detectAnime(url);
        emit.imageScanned(message.channel.id, message.author.tag ?? 'UNKNOWN', verdict);
        if (verdict) {
          logger.log('notice', 'Message removed', { title: 'Anime Purged', image: url, data: { user: message.author.tag, keywords: Object.fromEntries(counts), url } });
          return [{ type: BotActionType.RemoveMessage, channelId: message.channel.id, messageId: message.id }];
        }
      }
      return [];
    },
  };
};
