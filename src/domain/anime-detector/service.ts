import { ReverseImageSearchService } from './image-search/service';
import { AnimeDetectorConfig } from './module';

export const animeDetectorService = (config: AnimeDetectorConfig, { reverseSearch, countKeywordOccurrences }: ReverseImageSearchService) =>
  async (imageUrl: string): Promise<[verdict: boolean, counts: Map<string, number>]> => {
    const results = await reverseSearch(imageUrl);
    const counts = countKeywordOccurrences(results, config.keywords);
    const totalCount = Array.from(counts.values()).reduce((total, count) => total + count, 0);
    return [totalCount >= config.keywordCountThreshold, counts];
  };
