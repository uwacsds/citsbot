import fetch from 'node-fetch';
import { LoggingService } from '../../utils/logging';

const SEARCH_URL = `https://images.google.com/searchbyimage?image_url=`;
const USER_AGENT = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36`;

export interface ReverseImageSearchService {
  (imageUrl: string): Promise<string>
}

export const reverseImageSearchService = (
  { log }: LoggingService
): ReverseImageSearchService => 
  async imageUrl => {
    log(`info`, `Performing reverse image search`, { title: `Reverse Image Search Service`, image: imageUrl, data: { imageUrl } });
    const result = await fetch(formatSearchUrl(imageUrl), { headers: { 'User-Agent': USER_AGENT } });
    return result.text();
  };

const formatSearchUrl = (imageUrl: string): string => `${SEARCH_URL}${encodeURI(imageUrl)}`;
