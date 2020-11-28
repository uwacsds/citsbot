import { mockLogger } from '../../utils/logging';
import { BotActionType } from '../action-types';
import { BotConfig } from '../config';
import { DiscordMessage } from '../discord-types';
import { cowsayModule } from './cowsay';

describe('cowsay-module', () => {
  const now = () => new Date('2020-01-01');
  const config: DeepPartial<BotConfig> = {
    prefix: '!',
    modules: {
      cowsay: {
        lineMaxLen: 40,
        cowArt:
          '\n     \\   ^__^\n      \\  (oo)\\_______\n         (__)\\       )\\/\\\n             ||----w |\n             ||     ||',
      },
    },
  };
  const cowsay = cowsayModule(config as BotConfig, mockLogger());

  const message: DiscordMessage = {
    id: '1',
    createdAt: now(),
    deletable: true,
    content: '',
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
    await expect(cowsay.onMessage({ ...message, content: '!cowsay this is a short one liner' })).resolves.toEqual({
      channelId: message.channel.id,
      type: BotActionType.Message,
      messageContent:
        '```\n  _________________________\n< this is a short one liner >\n  -------------------------\n     \\   ^__^\n      \\  (oo)\\_______\n         (__)\\       )\\/\\\n             ||----w |\n             ||     ||\n```',
    });
  });

  it('should format a long multi line message', async () => {
    const action = cowsay.onMessage({
      ...message,
      content:
        '!cowsay Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pretium in enim quis pulvinar. Nam vulputate, orci tincidunt suscipit commodo, dolor libero rhoncus orci, non aliquet risus purus in est. Nunc fringilla pellentesque ante, at ultrices enim euismod in. Etiam rhoncus ipsum vel ex fermentum mollis. Aliquam auctor sit amet est vel aliquet. Suspendisse eleifend orci eget massa finibus, sed dictum turpis blandit. Pellentesque pellentesque sodales mauris, in malesuada velit. Nullam at eros lacus. Etiam sed odio semper, tempor mauris eget, laoreet quam. Proin quis magna fermentum, suscipit ipsum non, posuere odio. Suspendisse hendrerit elit vitae metus maximus facilisis. Nunc.',
    });
    await expect(action).resolves.toEqual({
      channelId: message.channel.id,
      type: BotActionType.Message,
      messageContent:
        '```\n  _______________________________________\n/ Lorem ipsum dolor sit amet, consectetur \\\n| adipiscing elit. Nullam pretium in enim |\n| quis pulvinar. Nam vulputate, orci      |\n| tincidunt suscipit commodo, dolor       |\n| libero rhoncus orci, non aliquet risus  |\n| purus in est. Nunc fringilla            |\n| pellentesque ante, at ultrices enim     |\n| euismod in. Etiam rhoncus ipsum vel ex  |\n| fermentum mollis. Aliquam auctor sit    |\n| amet est vel aliquet. Suspendisse       |\n| eleifend orci eget massa finibus, sed   |\n| dictum turpis blandit. Pellentesque     |\n| pellentesque sodales mauris, in         |\n| malesuada velit. Nullam at eros lacus.  |\n| Etiam sed odio semper, tempor mauris    |\n| eget, laoreet quam. Proin quis magna    |\n| fermentum, suscipit ipsum non, posuere  |\n| odio. Suspendisse hendrerit elit vitae  |\n\\ metus maximus facilisis. Nunc.          /\n  ---------------------------------------\n     \\   ^__^\n      \\  (oo)\\_______\n         (__)\\       )\\/\\\n             ||----w |\n             ||     ||\n```',
    });
  });

  it('should not do anything on a standard message with no prefix', async () => {
    await expect(cowsay.onMessage({ ...message, content: 'hello world' })).resolves.toEqual({
      type: BotActionType.Nothing,
    });
  });

  it('should not do anything with a different prefix', async () => {
    await expect(cowsay.onMessage({ ...message, content: '!announce now' })).resolves.toEqual({
      type: BotActionType.Nothing,
    });
  });

  it('should not do anything when no space after prefix', async () => {
    await expect(cowsay.onMessage({ ...message, content: '!cowsayno baa' })).resolves.toEqual({
      type: BotActionType.Nothing,
    });
  });
});
