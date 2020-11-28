import { LoggingService } from '../../utils/logging';
import { BotAction, BotActionType } from '../action-types';
import { DiscordMessage } from '../discord-types';
import { AnimeDetectorModule, ModuleType } from '../module-types';

const patternAnyImageUrl = /\w*?(https?:\/\/[^ ]+?\.(jpg|jpeg|png))\w*?/gi;
const patternImgurId = /\w*?https?:\/\/(i.)?imgur\.com\/(?<id>[^\. ]+)\w*?/gi;

const parsePlainImageUrls = (message: string): string[] =>
  Array.from(message.matchAll(patternAnyImageUrl)).map((match) => match[0]);
const parseImgurUrls = (message: string): string[] =>
  Array.from(message.matchAll(patternImgurId))
    .map((match) => match.groups?.id)
    .map((id) => `https://i.imgur.com/${id}.png`); // we can use any file extension
const parseImageUrls = (message: string): string[] =>
  Array.from(new Set([...parsePlainImageUrls(message), ...parseImgurUrls(message)]));

export const animeDetectorModule = ({ log }: LoggingService): AnimeDetectorModule => ({
  type: ModuleType.AnimeDetector,
  onMessage: async (message: DiscordMessage): Promise<BotAction> => {
    const urls = parseImageUrls(message.content);

    return { type: BotActionType.Nothing };
  },
});
