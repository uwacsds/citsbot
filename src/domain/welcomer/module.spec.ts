import { DiscordUser, DiscordMessage } from '../../discord/types';
import { mockLogger } from '../../utils/logging';
import { BotActionType } from '../action-types';
import { WelcomerConfig } from './config';
import { welcomerModule } from './module';

describe(`welcomer module`, () => {
  const now = new Date(`2020-01-01T00:00Z`);
  jest.useFakeTimers(`modern`).setSystemTime(now);

  const config: WelcomerConfig = {
    channel: `channelId`,
    newMemberDm: { delay: 3000, instantAccountAge: 7, message: `hello {name}`, roleThreshold: 1 },
  };

  const welcomer = welcomerModule(mockLogger(), { directMessageSent: jest.fn(), userJoin: jest.fn() }, config, () => now);

  test(`given an old user > when member join > should dispatch embed message and direct message with delay and condition`, async () => {
    const previousYear = new Date(now);
    previousYear.setUTCFullYear(now.getUTCFullYear() - 1);

    const user: DiscordUser = { avatar: `https://avatar.png`, bot: false, createdAt: previousYear, discriminator: `1234`, id: `id1`, tag: `testUser#1234`, username: `testUser` };

    await expect(welcomer.onMemberJoin(user)).resolves.toEqual([
      {
        type: BotActionType.EmbeddedMessage,
        channelId: config.channel,
        embed: {
          title: `Hello, world!`,
          description: `Hey, ${user.username}`,
          colour: `#0864a5`,
          thumbnail: user.avatar,
          fields: [{ name: `Hot tip`, value: `Check out the rules at #overview` }],
          footer: { text: `Joined • ${now.toDateString()}`, iconUrl: user.avatar },
        },
      },
      {
        type: BotActionType.DirectMessage,
        userId: user.id,
        messageContent: config.newMemberDm.message.replaceAll(`{name}`, user.username ?? ``),
        delay: config.newMemberDm.delay,
        condition: expect.any(Function), // TODO: test this callback
      },
    ]);
  });

  test(`given a new user > when member join > should dispatch embed message and instant direct message`, async () => {
    const user: DiscordUser = { avatar: `https://avatar.png`, bot: false, createdAt: now, discriminator: `1234`, id: `id1`, tag: `testUser#1234`, username: `testUser` };

    await expect(welcomer.onMemberJoin(user)).resolves.toEqual([
      {
        type: BotActionType.EmbeddedMessage,
        channelId: config.channel,
        embed: {
          title: `Hello, world!`,
          description: `Hey, ${user.username}`,
          colour: `#0864a5`,
          thumbnail: user.avatar,
          fields: [{ name: `Hot tip`, value: `Check out the rules at #overview` }],
          footer: { text: `Joined • ${now.toDateString()}`, iconUrl: user.avatar },
        },
      },
      {
        type: BotActionType.DirectMessage,
        userId: user.id,
        messageContent: config.newMemberDm.message.replaceAll(`{name}`, user.username ?? ``),
        delay: 0,
        condition: expect.any(Function), // TODO: test this callback
      },
    ]);
  });

  test(`given welcome channel > when message > should dispatch add reaction`, async () => {
    const message: DiscordMessage = { author: undefined as never, channel: { id: config.channel, createdAt: now, type: `text` }, content: `welcome to the server!`, createdAt: now, deletable: true, id: `msg1`,attachments: [], isSystemMessage: false };
    await expect(welcomer.onMessage(message)).resolves.toEqual([
      {
        type: BotActionType.AddReaction,
        channelId: message.channel.id,
        messageId: message.id,
        emoji: `👋`,
      },
    ]);
  });
});
