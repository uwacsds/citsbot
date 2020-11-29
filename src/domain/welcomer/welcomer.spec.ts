import { mockLogger } from '../../utils/logging';
import { BotActionType } from '../action-types';
import { DiscordMessage, DiscordUser } from '../discord-types';
import { WelcomerConfig, welcomerModule } from './welcomer';

describe('welcomer module', () => {
  const now = new Date('2020-01-01T00:00Z');
  jest.useFakeTimers('modern').setSystemTime(now);

  const config: WelcomerConfig = {
    channel: 'channelId',
    newMemberDm: { delay: 1, instantAccountAge: 1, message: '', react: 'reactEmoji', roleThreshold: 1 },
  };

  const welcomer = welcomerModule(config, mockLogger());

  it('should create an embedded message action to welcome the user', async () => {
    const user: DiscordUser = { avatar: 'https://avatar.png', bot: false, createdAt: now, discriminator: '1234', id: 'id1', tag: 'testUser#1234', username: 'testUser' };
    await expect(welcomer.onMemberJoin(user)).resolves.toEqual({
      type: BotActionType.EmbeddedMessage,
      channelId: config.channel,
      embed: {
        title: 'Hello, world!',
        description: `Hey, ${user.username}`,
        colour: '#0864a5',
        thumbnail: user.avatar,
        fields: [{ name: 'Hot tip', value: 'Check out the rules at #overview' }],
        footer: { text: `Joined • ${now.toDateString()}`, iconUrl: user.avatar },
      },
    });
  });

  it('should create a wave at event for a message', async () => {
    const message: DiscordMessage = {
      author: null as never,
      channel: { id: config.channel, createdAt: now, type: 'text' },
      content: 'welcome to the server!',
      createdAt: now,
      deletable: true,
      id: 'msg1',
      attachments: [],
    };
    await expect(welcomer.onMessage(message)).resolves.toEqual({
      type: BotActionType.AddReaction,
      channelId: message.channel.id,
      messageId: message.id,
      emoji: config.newMemberDm.react,
    });
  });
});
