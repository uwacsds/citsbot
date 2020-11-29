import nock from 'nock';
import { mockLogger } from '../../utils/logging';
import { AnimeDetectorConfig } from './anime-detector';
import { animeDetectorService } from './service';

describe('anime-detector-service', () => {
  const createNocks = (imageUrl: string, resultsPage: string) => {
    nock('https://images.google.com')
      .get(`/searchbyimage?image_url=${imageUrl}`)
      .reply(302, '', { location: `https://www.google.com/search?tbs=sbi:${imageUrl}` });
    nock('https://www.google.com').get(`/search?tbs=sbi:${imageUrl}`).reply(200, resultsPage);
  };
  createNocks('anime.png', 'anime hello anime world anime manga manga anime something else');
  createNocks('notQuiteAnime.png', 'anime hello this has a references to manga and anime but it is not over the threshold');
  createNocks('notAnime.png', 'something else that does not mention it once');

  const config: AnimeDetectorConfig = { keywordCountThreshold: 5, keywords: ['anime', 'manga'] };
  const detectAnime = animeDetectorService(config, mockLogger());

  it('given image that is anime > when detect anime > should return true verdict and word counts', async () => {
    await expect(detectAnime('anime.png')).resolves.toEqual([true, new Map().set('anime', 4).set('manga', 2)]);
  });

  it('given image that is not quite anime > when detect anime > should return false verdict and word counts', async () => {
    await expect(detectAnime('notQuiteAnime.png')).resolves.toEqual([false, new Map().set('anime', 2).set('manga', 1)]);
  });

  it('given image that is not anime > when detect anime > should return false verdict and word counts', async () => {
    await expect(detectAnime('notAnime.png')).resolves.toEqual([false, new Map().set('anime', 0).set('manga', 0)]);
  });
});
