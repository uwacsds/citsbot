import { DiscordUser, DiscordMessageAttachment, DiscordMessage } from '../../discord/types';
import { BotActionType } from '../action-types';
import { animeDetectorModule } from './module';
import { AnimeDetectorResult } from './detector-service';

describe(`anime detector module`, () => {
  const now = new Date(`2020-01-01`);

  const USER: DiscordUser = { avatar: ``, bot: false, id: `user1`, createdAt: now, discriminator: `1234`, tag: `user#1234`, username: `user` };
  const ATTACHMENT: DiscordMessageAttachment = { id: `att1`, width: 1, height: 1, size: 8, url: `` };
  const MESSAGE: DiscordMessage = { id: `msg1`, content: ``, author: USER, attachments: [], channel: { id: `ch1`, type: `text`, createdAt: now }, deletable: false, createdAt: now };
  const ACTION_REMOVE = { type: BotActionType.RemoveMessage, channelId: MESSAGE.channel.id, messageId: MESSAGE.id };

  const mockDetectAnimeImplementation = (url: string): Promise<AnimeDetectorResult> => {
    const testUrls: { [url: string]: AnimeDetectorResult } = {
      // imgur
      [`https://imgur.com/anime`]: { verdict: true, keywordCounts: { [`anime`]: 123 } },
      [`https://i.imgur.com/anime.png`]: { verdict: true, keywordCounts: { [`anime`]: 234 } },
      [`https://imgur.com/notAnime`]: { verdict: false, keywordCounts: { [`anime`]: 0 } },
      [`https://i.imgur.com/notAnime.png`]: { verdict: false, keywordCounts: { [`anime`]: 0 } },
      // generic links to anime with varying extensions - jpg|jpeg|png|tif|bmp|gif|webp
      [`https://example.com/anime.jpg`]: { verdict: true, keywordCounts: { [`anime`]: 345 } },
      [`https://example.com/anime.jpeg`]: { verdict: true, keywordCounts: { [`anime`]: 456 } },
      [`https://example.com/anime.png`]: { verdict: true, keywordCounts: { [`anime`]: 567 } },
      [`https://example.com/anime.tif`]: { verdict: true, keywordCounts: { [`anime`]: 678 } },
      [`https://example.com/anime.bmp`]: { verdict: true, keywordCounts: { [`anime`]: 789 } },
      [`https://example.com/anime.gif`]: { verdict: true, keywordCounts: { [`anime`]: 890 } },
      [`https://example.com/anime.webp`]: { verdict: true, keywordCounts: { [`anime`]: 901 } },
      // generic links to non-anime with varying extensions - jpg|jpeg|png|tif|bmp|gif|webp
      [`https://example.com/notAnime.jpg`]: { verdict: false, keywordCounts: { [`anime`]: 0 } },
      [`https://example.com/notAnime.jpeg`]: { verdict: false, keywordCounts: { [`anime`]: 0 } },
      [`https://example.com/notAnime.png`]: { verdict: false, keywordCounts: { [`anime`]: 0 } },
      [`https://example.com/notAnime.tif`]: { verdict: false, keywordCounts: { [`anime`]: 0 } },
      [`https://example.com/notAnime.bmp`]: { verdict: false, keywordCounts: { [`anime`]: 0 } },
      [`https://example.com/notAnime.gif`]: { verdict: false, keywordCounts: { [`anime`]: 0 } },
      [`https://example.com/notAnime.webp`]: { verdict: false, keywordCounts: { [`anime`]: 0 } },
      // discord cdn
      [`https://cdn.discordapp.com/attachments/123/456/anime.png`]: { verdict: true, keywordCounts: { [`anime`]: 321 } },
      [`https://cdn.discordapp.com/attachments/123/456/notAnime.png`]: { verdict: false, keywordCounts: { [`anime`]: 0 } },
    };
    return Promise.resolve(testUrls[url]);
  };

  const log = jest.fn();
  const mockImageScannedEmitter = jest.fn();
  const detectAnime = jest.fn(mockDetectAnimeImplementation);
  const uploadImage = jest.fn();
  const { onMessage } = animeDetectorModule({ log, initialise: jest.fn() }, { imageScanned: mockImageScannedEmitter }, detectAnime, uploadImage);

  beforeEach(() => {
    mockImageScannedEmitter.mockReset();
    detectAnime.mockReset().mockImplementation(mockDetectAnimeImplementation);
    uploadImage.mockReset();
  });
  
  test(`given message with no attachments and no image links > on message > should do nothing`, async () => {
    await expect(onMessage(MESSAGE)).resolves.toEqual([]);
  });

  test(`given image backup fails > on message > should revert to original url`, async () => {
    uploadImage.mockRejectedValue(Error(`Imgur is down!`));
    await onMessage({ ...MESSAGE, content: `https://i.imgur.com/anime.png` });
    expect(uploadImage).toHaveBeenCalledWith(`https://i.imgur.com/anime.png`);
    expect(log).toHaveBeenCalledWith(`warning`, `Failed to backup image`, { title: `Image Backup Failed`, image: `https://i.imgur.com/anime.png`, data: { url: `https://i.imgur.com/anime.png`, error: `Error: Imgur is down!` } });
    expect(log).toHaveBeenCalledWith(`notice`, `Message removed`, { title: `Anime Purged`, image: `https://i.imgur.com/anime.png`, data: { user: MESSAGE.author.tag, keywords: { [`anime`]: 234 }, originalImageUrl: `https://i.imgur.com/anime.png`, backedUpImageUrl: undefined } });
  });

  test(`given image backup succeeds > on message > should log with backed up image url`, async () => {
    uploadImage.mockResolvedValue(`http://imgur.local/backup.png`);
    await onMessage({ ...MESSAGE, content: `https://i.imgur.com/anime.png` });
    expect(uploadImage).toHaveBeenCalledWith(`https://i.imgur.com/anime.png`);
    expect(log).toHaveBeenCalledWith(`notice`, `Message removed`, { title: `Anime Purged`, image: `http://imgur.local/backup.png`, data: { user: MESSAGE.author.tag, keywords: { [`anime`]: 234 }, originalImageUrl: `https://i.imgur.com/anime.png`, backedUpImageUrl: `http://imgur.local/backup.png` } });
  });

  test.each([
    [`https://imgur.com/anime`, [ACTION_REMOVE], true],
    [`https://i.imgur.com/anime.png`, [ACTION_REMOVE], true],
    [`https://imgur.com/notAnime`, [], false],
    [`https://i.imgur.com/notAnime.png`, [], false],
  ])(`given imgur links in message content %p > on message > should come to correct verdict and emit metric`, async (url, actions, verdict) => {
    await expect(onMessage({ ...MESSAGE, content: url })).resolves.toEqual(actions);
    expect(mockImageScannedEmitter).toHaveBeenCalledWith(`user#1234`, verdict);
    if (verdict) expect(uploadImage).toHaveBeenCalled();
    else expect(uploadImage).not.toHaveBeenCalled();
  });

  test.each([
    [`https://example.com/anime.jpg`, [ACTION_REMOVE], true],
    [`https://example.com/anime.jpeg`, [ACTION_REMOVE], true],
    [`https://example.com/anime.png`, [ACTION_REMOVE], true],
    [`https://example.com/anime.tif`, [ACTION_REMOVE], true],
    [`https://example.com/anime.bmp`, [ACTION_REMOVE], true],
    [`https://example.com/anime.gif`, [ACTION_REMOVE], true],
    [`https://example.com/anime.webp`, [ACTION_REMOVE], true],
    [`https://example.com/notAnime.jpg`, [], false],
    [`https://example.com/notAnime.jpeg`, [], false],
    [`https://example.com/notAnime.png`, [], false],
    [`https://example.com/notAnime.tif`, [], false],
    [`https://example.com/notAnime.bmp`, [], false],
    [`https://example.com/notAnime.gif`, [], false],
    [`https://example.com/notAnime.webp`, [], false],
  ])(`given standard links with various extensions in message content %p > on message > should come to correct verdict and emit metric`, async (url, actions, verdict) => {
    await expect(onMessage({ ...MESSAGE, content: url })).resolves.toEqual(actions);
    expect(mockImageScannedEmitter).toHaveBeenCalledWith(`user#1234`, verdict);
    if (verdict) expect(uploadImage).toHaveBeenCalledWith(url);
    else expect(uploadImage).not.toHaveBeenCalled();
  });

  test.each([
    [`https://cdn.discordapp.com/attachments/123/456/anime.png`, [ACTION_REMOVE], true],
    [`https://cdn.discordapp.com/attachments/123/456/notAnime.png`, [], false],
  ])(`given images attached > on message > should come to correct verdict`, async (url, actions, verdict) => {
    await expect(onMessage({ ...MESSAGE, attachments: [{ ...ATTACHMENT, url }] })).resolves.toEqual(actions);
    expect(mockImageScannedEmitter).toHaveBeenCalledWith(`user#1234`, verdict);
    if (verdict) expect(uploadImage).toHaveBeenCalledWith(url);
    else expect(uploadImage).not.toHaveBeenCalled();
  });
});
