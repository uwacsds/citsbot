import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { LoggingService } from '../utils/logging';

const SEARCH_URL = 'https://images.google.com/searchbyimage?image_url=';
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36';

const formatSearchUrl = (imageUrl: string): string => `${SEARCH_URL}${encodeURI(imageUrl)}`;

export const reverseImageSearchService = ({ log }: LoggingService) => ({
  countWords: async (imageUrl: string, words: string[]) => {
    log('info', 'Performing reverse image keyword search', {
      title: 'Reverse Image Search Service',
      data: { imageUrl },
    });
    const result = await fetch(formatSearchUrl(imageUrl), { headers: { 'User-Agent': USER_AGENT } });
    const html = await result.text();
    const counts = words.map((word) => [word, html.match(new RegExp(word, 'g'))?.length ?? 0]);

    log('info', 'Finished reverse image keyword search', { title: 'Reverse Image Search Service', data: { counts } });
    return counts;
  },
});
