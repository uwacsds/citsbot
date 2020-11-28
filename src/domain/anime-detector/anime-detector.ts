import { reverseImageSearchService } from '../../image-search/reverse-image-search';
import { LoggingService } from '../../utils/logging';
import { BotAction, BotActionType } from '../action-types';
import { DiscordMessage, DiscordMessageAttachment } from '../discord-types';
import { AnimeDetectorModule, ModuleType } from '../module-types';

const patternAnyImageUrl = /\w*?(https?:\/\/[^ ]+?\.(jpg|jpeg|png))\w*?/gi;
const patternImgurId = /\w*?https?:\/\/(i.)?imgur\.com\/(?<id>[^\. ]+)\w*?/gi;

export interface AnimeDetectorConfig {
  keywords: string[];
  keywordCountThreshold: number;
}

const parsePlainImageUrls = (message: string): string[] =>
  Array.from(message.matchAll(patternAnyImageUrl)).map((match) => match[0]);

const parseImgurUrls = (message: string): string[] => Array.from(message.matchAll(patternImgurId))
  .map((match) => match.groups?.id)
  .map((id) => `https://i.imgur.com/${id}.png`); // we can use any file extension

const parseContentUrls = (message: string): string[] => [...parsePlainImageUrls(message), ...parseImgurUrls(message)];

const parseAttachmentUrls = (attachments: DiscordMessageAttachment[]): string[] =>
  attachments.filter(({ width }) => width !== null).map(({ url }) => url);

export const animeDetectorModule = (config: AnimeDetectorConfig, logger: LoggingService): AnimeDetectorModule => {
  const { countWords } = reverseImageSearchService(logger);
  return {
    type: ModuleType.AnimeDetector,
    onMessage: async (message: DiscordMessage): Promise<BotAction> => {
      const urls = new Set([...parseAttachmentUrls(message.attachments), ...parseContentUrls(message.content)]);
      for (const url of urls) {
        const counts = await countWords(url, config.keywords);
        const totalCount = counts.reduce((total, [_, count]) => total + count, 0);
        if (totalCount > config.keywordCountThreshold) {
          logger.log('notice', 'Message removed', { title: 'Anime Purged', image: url, data: { user: message.author.tag, keywords: counts } });
          return { type: BotActionType.RemoveMessage, channelId: message.channel.id, messageId: message.id };
        }
      }
      return { type: BotActionType.Nothing };
    },
  };
};
