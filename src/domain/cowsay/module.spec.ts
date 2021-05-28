import { DiscordMessage } from '../../discord/types';
import { mockLogger } from '../../utils/logging';
import { BotActionType } from '../action-types';
import { cowsayModule } from './module';

describe(`cowsay-module`, () => {
  const now = () => new Date(`2020-01-01`);
  const globalPrefix = `!`;
  const mockFormatter = jest.fn();

  const cowsay = cowsayModule(mockLogger(), globalPrefix, mockFormatter);

  beforeEach(() => {
    mockFormatter.mockReset().mockReturnValue(`moo`);
  });

  const message: DiscordMessage = {
    id: `1`, createdAt: now(), deletable: true, content: ``, attachments: [], 
    author: { avatar: `avatar1`, bot: false, createdAt: now(), discriminator: `discriminator1`, id: `user1`, tag: `tag1`, username: `user1` },
    channel: { createdAt: now(), type: `text`, id: `ch1` },
  };

  test(`given correct global and module prefix > when handle message > should dispatch message action`, async () => {
    await expect(cowsay.onMessage({ ...message, content: `!cowsay moo` })).resolves.toEqual([{ channelId: message.channel.id, type: BotActionType.Message, messageContent: `moo` }]);
    expect(mockFormatter).toHaveBeenCalledWith(`moo`);
  });

  test(`given incorrect global prefix but correct module prefix > when handle message > should dispatch no actions`, async () => {
    await expect(cowsay.onMessage({ ...message, content: `?cowsay moo` })).resolves.toEqual([]);
    expect(mockFormatter).not.toHaveBeenCalled();
  });

  test(`given correct global prefix but incorrect module prefix > when handle message > should dispatch no actions`, async () => {
    await expect(cowsay.onMessage({ ...message, content: `!sheepsay baa` })).resolves.toEqual([]);
    expect(mockFormatter).not.toHaveBeenCalled();
  });

  test(`given correct global and module prefix but no space after prefix > when handle message > should dispatch no actions`, async () => {
    await expect(cowsay.onMessage({ ...message, content: `!cowsayextra moo` })).resolves.toEqual([]);
    expect(mockFormatter).not.toHaveBeenCalled();
  });
});
