import { LoggingService } from '../../utils/logging';

export interface KeywordCounterService {
  (text: string, keywords: string[]): { [keyword: string]: number };
}

export const keywordCounterService = (
  { log }: LoggingService
): KeywordCounterService => {

  const countOccurrences = (text: string, word: string): number => text.match(new RegExp(`${word}[^a-zA-Z]`, `g`))?.length ?? 0;

  return (text, keywords) => {
    const counts = keywords.reduce((counts, word) => ({ ...counts, [word]: countOccurrences(text, word) }), {});
    log(`info`, `Found Keywords`, { title: `Reverse Image Search Service`, data: { counts } });
    return counts;
  };
};
