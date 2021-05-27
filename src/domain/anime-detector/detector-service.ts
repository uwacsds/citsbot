import { AnimeDetectorConfig } from './config';
import { KeywordCounterService } from './keyword-counter';
import { ReverseImageSearchService } from './reverse-image-search';

export interface AnimeDetectorResult { 
  verdict: boolean, 
  keywordCounts: { [keyword: string]: number }
}

export interface AnimeDetectorService {
  (imageUrl: string): Promise<AnimeDetectorResult>
}

export const animeDetectorService = (
  config: AnimeDetectorConfig,
  reverseSearch: ReverseImageSearchService,
  countKeywords: KeywordCounterService,
): AnimeDetectorService =>
  async imageUrl => {
    const results = await reverseSearch(imageUrl);
    const counts = countKeywords(results, config.keywords);
    const totalCount = Object.values(counts).reduce((total, count) => total + count, 0);
    return { 
      verdict: totalCount >= config.keywordCountThreshold, 
      keywordCounts: counts,
    };
  };
