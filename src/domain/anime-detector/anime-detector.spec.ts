import nock from 'nock';
import { mockLogger } from '../../utils/logging';
import { BotActionType } from '../action-types';
import { DiscordMessage, DiscordMessageAttachment, DiscordUser } from '../discord-types';
import { AnimeDetectorConfig, animeDetectorModule } from './anime-detector';

describe('anime-detector-module', () => {
  const now = new Date('2020-01-01');

  const createNocks = (imageUrl: string, resultsPage: string) => {
    nock('https://images.google.com')
      .get(`/searchbyimage?image_url=${imageUrl}`)
      .times(999)
      .reply(302, '', { location: `https://www.google.com/search?tbs=sbi:${imageUrl}` });
    nock('https://www.google.com').get(`/search?tbs=sbi:${imageUrl}`).times(999).reply(200, resultsPage);
  };
  // imgur urls
  createNocks('https://imgur.com/anime', 'anime');
  createNocks('https://i.imgur.com/anime.png', 'anime');
  createNocks('https://imgur.com/notAnime', 'clean');
  createNocks('https://i.imgur.com/notAnime.png', 'clean');
  // generic links to anime with varying extensions - jpg|jpeg|png|tif|bmp|gif|webp
  createNocks('https://example.com/anime.jpg', 'anime');
  createNocks('https://example.com/anime.jpeg', 'anime');
  createNocks('https://example.com/anime.png', 'anime');
  createNocks('https://example.com/anime.tif', 'anime');
  createNocks('https://example.com/anime.bmp', 'anime');
  createNocks('https://example.com/anime.gif', 'anime');
  createNocks('https://example.com/anime.webp', 'anime');
  // generic links to non-anime with varying extensions - jpg|jpeg|png|tif|bmp|gif|webp
  createNocks('https://example.com/notAnime.jpg', 'clean');
  createNocks('https://example.com/notAnime.jpeg', 'clean');
  createNocks('https://example.com/notAnime.png', 'clean');
  createNocks('https://example.com/notAnime.tif', 'clean');
  createNocks('https://example.com/notAnime.bmp', 'clean');
  createNocks('https://example.com/notAnime.gif', 'clean');
  createNocks('https://example.com/notAnime.webp', 'clean');
  // discord cdn
  createNocks('https://cdn.discordapp.com/attachments/123/456/anime.png', 'anime');
  createNocks('https://cdn.discordapp.com/attachments/123/456/notAnime.png', 'clean');

  const USER: DiscordUser = { avatar: '', bot: false, id: 'user1', createdAt: now, discriminator: '1234', tag: 'user#1234', username: 'user' };
  const ATTACHMENT: DiscordMessageAttachment = { id: 'att1', width: 1, height: 1, size: 8, url: '' };
  const MESSAGE: DiscordMessage = { id: 'msg1', content: '', author: USER, attachments: [], channel: { id: 'ch1', type: 'text', createdAt: now }, deletable: false, createdAt: now };
  const ACTION_REMOVE = { type: BotActionType.RemoveMessage, channelId: MESSAGE.channel.id, messageId: MESSAGE.id };

  const config: AnimeDetectorConfig = { keywordCountThreshold: 1, keywords: ['anime'] };
  const { onMessage } = animeDetectorModule(config, mockLogger());

  it('given message with no attachments and no image links > on message > should do nothing', async () => {
    await expect(onMessage(MESSAGE)).resolves.toEqual([]);
  });

  it('given imgur links in message content > on message > should come to correct verdicts', async () => {
    await expect(onMessage({ ...MESSAGE, content: 'https://imgur.com/anime' })).resolves.toEqual([ACTION_REMOVE]);
    await expect(onMessage({ ...MESSAGE, content: 'https://i.imgur.com/anime.png' })).resolves.toEqual([ACTION_REMOVE]);
    await expect(onMessage({ ...MESSAGE, content: 'https://imgur.com/notAnime' })).resolves.toEqual([]);
    await expect(onMessage({ ...MESSAGE, content: 'https://i.imgur.com/notAnime.png' })).resolves.toEqual([]);
  });

  it('given standard links with various extensions in message content > on message > should come to correct verdicts', async () => {
    await expect(onMessage({ ...MESSAGE, content: 'https://example.com/anime.jpg' })).resolves.toEqual([ACTION_REMOVE]);
    await expect(onMessage({ ...MESSAGE, content: 'https://example.com/anime.jpeg' })).resolves.toEqual([ACTION_REMOVE]);
    await expect(onMessage({ ...MESSAGE, content: 'https://example.com/anime.tif' })).resolves.toEqual([ACTION_REMOVE]);
    await expect(onMessage({ ...MESSAGE, content: 'https://example.com/anime.bmp' })).resolves.toEqual([ACTION_REMOVE]);
    await expect(onMessage({ ...MESSAGE, content: 'https://example.com/anime.gif' })).resolves.toEqual([ACTION_REMOVE]);
    await expect(onMessage({ ...MESSAGE, content: 'https://example.com/anime.webp' })).resolves.toEqual([ACTION_REMOVE]);

    await expect(onMessage({ ...MESSAGE, content: 'https://example.com/notAnime.jpg' })).resolves.toEqual([]);
    await expect(onMessage({ ...MESSAGE, content: 'https://example.com/notAnime.jpeg' })).resolves.toEqual([]);
    await expect(onMessage({ ...MESSAGE, content: 'https://example.com/notAnime.tif' })).resolves.toEqual([]);
    await expect(onMessage({ ...MESSAGE, content: 'https://example.com/notAnime.bmp' })).resolves.toEqual([]);
    await expect(onMessage({ ...MESSAGE, content: 'https://example.com/notAnime.gif' })).resolves.toEqual([]);
    await expect(onMessage({ ...MESSAGE, content: 'https://example.com/notAnime.webp' })).resolves.toEqual([]);
  });

  it('given images attached > on message > should come to correct verdict', async () => {
    await expect(onMessage({ ...MESSAGE, attachments: [{ ...ATTACHMENT, url: 'https://cdn.discordapp.com/attachments/123/456/anime.png' }] })).resolves.toEqual([ACTION_REMOVE]);
    await expect(onMessage({ ...MESSAGE, attachments: [{ ...ATTACHMENT, url: 'https://cdn.discordapp.com/attachments/123/456/notAnime.png' }] })).resolves.toEqual([]);
  });
});
