export interface ReverseImageSearchService {
  countKeywords: (imageUrl: string, words: string[]) => Promise<[word: string, count: number][]>;
}
