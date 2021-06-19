import fetch from 'node-fetch';

export interface ImageUploaderService {
  (imageUrl: string): Promise<string>
}

export const imgurImageUploaderService = (
  clientId: string,
): ImageUploaderService =>
  async imageUrl => {
    const response = await fetch(`https://api.imgur.com/3/image`, {
      method: `POST`,
      headers: { 'Accept': `application/json`, 'Authorization': `Client-ID ${clientId}` },
      body: imageUrl,
    });

    if (!response.ok) throw Error(`Failed to upload image to imgur. Got non-200 response code: ${response.status}, ${await response.text()}`);

    const data = await response.json();
    const imgurLink = data?.data?.link;
    if (typeof imgurLink !== `string`) throw Error(`Failed to upload image to imgur. Link not present in response body: ${JSON.stringify(data)}`);

    return imgurLink;
  };
