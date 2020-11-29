export interface ReverseImageSearchService {
  reverseSearch: (imageUrl: string) => Promise<string>;
  countKeywordOccurrences: (resultsPageHtml: string, keywords: string[]) => Map<string, number>;
}
