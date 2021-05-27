import { AnimeDetectorConfig } from './config';
import { animeDetectorService } from './detector-service';

describe(`anime detector service`, () => {
  const config: AnimeDetectorConfig = { keywordCountThreshold: 5, keywords: [`anime`, `manga`] };
  const mockReverseSearch = jest.fn();
  const mockCountKeywords = jest.fn();
  const detectAnime = animeDetectorService(config, mockReverseSearch, mockCountKeywords);

  beforeEach(() => {
    mockReverseSearch.mockReset();
    mockCountKeywords.mockReset();
  });

  test(`given total keyword count below threshold > when detect > should return false verdict`, async () => {
    mockReverseSearch.mockResolvedValue(`<html>no keywords here</html>`);
    mockCountKeywords.mockReturnValue({ [`anime`]: 0, [`manga`]: 0 });
    await expect(detectAnime(`notAnime.png`)).resolves.toEqual({ verdict: false, keywordCounts: { [`anime`]: 0, [`manga`]: 0 } });
    expect(mockReverseSearch).toHaveBeenCalledWith(`notAnime.png`);
    expect(mockCountKeywords).toHaveBeenCalledWith(`<html>no keywords here</html>`, config.keywords);
  });

  test(`given total keyword count at threshold > when detect > should return false verdict`, async () => {
    mockReverseSearch.mockResolvedValue(`<html>anime anime manga manga manga</html>`);
    mockCountKeywords.mockReturnValue({ [`anime`]: 2, [`manga`]: 3 });
    await expect(detectAnime(`anime.png`)).resolves.toEqual({ verdict: true, keywordCounts: { [`anime`]: 2, [`manga`]: 3 } });
    expect(mockReverseSearch).toHaveBeenCalledWith(`anime.png`);
    expect(mockCountKeywords).toHaveBeenCalledWith(`<html>anime anime manga manga manga</html>`, config.keywords);
  });
});
