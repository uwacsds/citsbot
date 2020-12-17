import { reverseImageSearchService } from './image-search/service';
import { LoggingService } from '../../utils/logging';
import { AnimeDetectorConfig } from './module';

export const animeDetectorService = (config: AnimeDetectorConfig, logger: LoggingService) => async (imageUrl: string): Promise<[verdict: boolean, counts: Map<string, number>]> => {
  const { reverseSearch, countKeywordOccurrences } = reverseImageSearchService(logger);
  const results = await reverseSearch(imageUrl);
  const counts = countKeywordOccurrences(results, config.keywords);
  const totalCount = Array.from(counts.values()).reduce((total, count) => total + count, 0);
  return [totalCount >= config.keywordCountThreshold, counts];
};
