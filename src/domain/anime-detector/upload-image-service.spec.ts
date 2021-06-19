import nock from 'nock';
import { imgurImageUploaderService } from './upload-image-service';

describe(`imgur image upload service`, () => {
  const clientId = `client-123`;
  const uploadImage = imgurImageUploaderService(clientId);
  
  test(`given 200 response > when upload > should return uploaded image url`, async () => {
    nock(`https://api.imgur.com`, { reqheaders: { 'Accept': `application/json`, 'Authorization': `Client-ID ${clientId}` } })
      .post(`/3/image`)
      .reply(200, { data: { link: `https://imgur.local/backup.png` } });

    await expect(uploadImage(`https://discord.local/image.png`)).resolves.toBe(`https://imgur.local/backup.png`);
  });

  test(`given non-200 response > when upload > should throw`, async () => {
    nock(`https://api.imgur.com`, { reqheaders: { 'Accept': `application/json`, 'Authorization': `Client-ID ${clientId}` } })
      .post(`/3/image`)
      .reply(500, `Something went wrong`);

    await expect(uploadImage(`https://discord.local/image.png`)).rejects.toThrowError(Error(`Failed to upload image to imgur. Got non-200 response code: 500, Something went wrong`));
  });
  
  test(`given 200 response with invalid body > when upload > should throw`, async () => {
    nock(`https://api.imgur.com`, { reqheaders: { 'Accept': `application/json`, 'Authorization': `Client-ID ${clientId}` } })
      .post(`/3/image`)
      .reply(200, { foo: `bar` });

    // eslint-disable-next-line no-useless-escape
    await expect(uploadImage(`https://discord.local/image.png`)).rejects.toThrowError(Error(`Failed to upload image to imgur. Link not present in response body: {\"foo\":\"bar\"}`));
  });
});
