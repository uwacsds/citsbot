import fetch from 'node-fetch';
import { LoggingService } from '../utils/logging';
import { ReverseImageSearchService } from './types';

const SEARCH_URL = 'https://images.google.com/searchbyimage?image_url=';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36';

const formatSearchUrl = (imageUrl: string): string => `${SEARCH_URL}${encodeURI(imageUrl)}`;

export const reverseImageSearchService = ({ log }: LoggingService): ReverseImageSearchService => ({
  reverseSearch: async (imageUrl: string): Promise<string> => {
    log('info', 'Performing reverse image search', { title: 'Reverse Image Search Service', image: imageUrl, data: { imageUrl } });
    const result = await fetch(formatSearchUrl(imageUrl), { headers: { 'User-Agent': USER_AGENT } });
    return result.text();
  },
  countKeywordOccurrences: (text: string, keywords: string[]): Map<string, number> => {
    const countOccurrences = (word: string): number => text.match(new RegExp(word, 'g'))?.length ?? 0;
    const counts = keywords.reduce((counts, word) => counts.set(word, countOccurrences(word)), new Map<string, number>());
    log('info', 'Found Keywords', { title: 'Reverse Image Search Service', data: { counts: Object.fromEntries(counts) } });
    return counts;
  },
});
