import { DiscordMessage } from '../../discord-service/types';
import { mockLogger } from '../../utils/logging';
import { BotActionType } from '../action-types';
import { BotConfig } from '../config';
import { cowsayModule } from './module';

describe('cowsay-module', () => {
  const now = () => new Date('2020-01-01');
  const config: DeepPartial<BotConfig> = {
    prefix: '!',
    modules: {
      cowsay: {
        lineMaxLen: 40,
        cowArt: '\n     \\   ^__^\n      \\  (oo)\\_______\n         (__)\\       )\\/\\\n             ||----w |\n             ||     ||',
      },
    },
  };
  const cowsay = cowsayModule(config as BotConfig, mockLogger());

  const message: DiscordMessage = {
    id: '1',
    createdAt: now(),
    deletable: true,
    content: '',
    attachments: [],
    author: {
      avatar: 'avatar1',
      bot: false,
      createdAt: now(),
      discriminator: 'discriminator1',
      id: 'user1',
      tag: 'tag1',
      username: 'user1',
    },
    channel: { createdAt: now(), type: 'text', id: 'ch1' },
  };

  it('should format a short one line message', async () => {
    const actions = await cowsay.onMessage({ ...message, content: '!cowsay moo' });
    expect(actions).toHaveLength(1);
    expect(actions[0]).toMatchObject({
      channelId: message.channel.id,
      type: BotActionType.Message,
    });
  });

  it('should not do anything on a standard message with no prefix', async () => {
    await expect(cowsay.onMessage({ ...message, content: 'hello world' })).resolves.toEqual([]);
  });

  it('should not do anything with a different prefix', async () => {
    await expect(cowsay.onMessage({ ...message, content: '!announce now' })).resolves.toEqual([]);
  });

  it('should not do anything when no space after prefix', async () => {
    await expect(cowsay.onMessage({ ...message, content: '!cowsayno baa' })).resolves.toEqual([]);
  });
});
