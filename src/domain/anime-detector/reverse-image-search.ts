import fetch from 'node-fetch';
import { LoggingService } from '../../utils/logging';

const SEARCH_URL = `https://images.google.com/searchbyimage?image_url=`;
const USER_AGENT = `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36`;

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
