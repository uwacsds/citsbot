import nock from 'nock';
import { mockLogger } from '../../utils/logging';
import { reverseImageSearchService } from './reverse-image-search';

describe(`reverse image search`, () => {
  const reverseImageSearch = reverseImageSearchService(mockLogger());

  test(`given search result > when reverse search > should return string contents of page`, async () => {
    const imageUrl = `https://some.image.png`;
    const imageId = `image-id`;
    const pageContent = `<html>Search Result</html>`;
    nock(`https://images.google.com`)
      .get(`/searchbyimage?image_url=${imageUrl}`)
      .reply(302, ``, { location: `https://www.google.com/search?tbs=sbi:${imageId}` });
    nock(`https://www.google.com`).get(`/search?tbs=sbi:${imageId}`).reply(200, pageContent);

    await expect(reverseImageSearch(imageUrl)).resolves.toEqual(pageContent);
  });
});
