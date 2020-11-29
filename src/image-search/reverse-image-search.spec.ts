import nock from 'nock';
import { mockLogger } from '../utils/logging';
import { reverseImageSearchService } from './reverse-image-search';

describe('reverse-image-search', () => {
  it('should count the number of keywords in the document', async () => {
    const imageUrl = 'https://some.image.png';
    const imageId = 'image-id';
    nock('https://images.google.com')
      .get(`/searchbyimage?image_url=${imageUrl}`)
      .reply(302, '', { location: `https://www.google.com/search?tbs=sbi:${imageId}` });
    nock('https://www.google.com').get(`/search?tbs=sbi:${imageId}`).reply(200, 'word1 another word asdasdword hello word');

    const { countWords } = reverseImageSearchService(mockLogger());
    await expect(countWords('https://some.image.png', ['word', 'hello'])).resolves.toEqual([
      ['word', 4],
      ['hello', 1],
    ]);
  });
});
