import nock from 'nock';
import { mockLogger } from '../../../utils/logging';
import { reverseImageSearchService } from './service';

describe('reverse-image-search', () => {
  const { reverseSearch, countKeywordOccurrences } = reverseImageSearchService(mockLogger());

  it('should return the results page for the reverse image search', async () => {
    const imageUrl = 'https://some.image.png';
    const imageId = 'image-id';
    const pageContent = 'word1 another word hello word';
    nock('https://images.google.com')
      .get(`/searchbyimage?image_url=${imageUrl}`)
      .reply(302, '', { location: `https://www.google.com/search?tbs=sbi:${imageId}` });
    nock('https://www.google.com').get(`/search?tbs=sbi:${imageId}`).reply(200, pageContent);

    await expect(reverseSearch(imageUrl)).resolves.toEqual(pageContent);
  });

  it('should count the keywords in the document', () => {
    expect(countKeywordOccurrences('word1 another word hello word', ['word', 'hello'])).toEqual(new Map().set('word', 3).set('hello', 1));
  });
});
