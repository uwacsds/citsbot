import { academicWeeksParser } from '../academic-calendar/weeks-parser';
import { academicCalendarService } from '../academic-calendar/academic-calendar-service';
import { BotActionType } from './action-types';
import { discordCommandHandler } from './command-handler';
import { BotConfig } from './config';
import { academicDeadlinesParser } from '../academic-calendar/deadlines-parser';
import { mockLogger } from '../utils/logging';
import { DiscordUser, DiscordMessage } from '../discord-service/types';

describe('command-handler', () => {
  jest.useFakeTimers();

  const now = new Date('2020-01-01T00:00Z');
  const config: BotConfig = {
    guild: 'guild_1',
    logChannel: 'ch_logs',
    prefix: '!',
    units: { unit1: { channels: { general: '', resources: '' }, name: 'unit_1', role: 'role_unit1' } },
    modules: {
      animeDetector: { keywordCountThreshold: 5, keywords: ['anime', 'manga'] },
      announcer: { channel: 'ch_announcer', crontab: '* * * * * *', colour: 'red', image: 'banner.png', disclaimer: 'test disclaimer' },
      cowsay: { cowArt: 'art', lineMaxLen: 40 },
      welcomer: { channel: 'ch_welcome', newMemberDm: { delay: 10, instantAccountAge: 10, message: 'msg', roleThreshold: 1 } },
      reactRoles: {
        messages: [
          { id: 'msg1', channel: 'channel1', reactions: [{ role: 'role1', emoji: 'emoji1' }] },
          { id: 'msg2', channel: 'channel2', reactions: [{ role: 'role2', emoji: 'emoji2' }] },
          { id: 'msg3', channel: 'channel1', reactions: [{ unit: 'unit1', emoji: 'emoji3' }] },
        ],
      },
    },
  };
  const user: DiscordUser = { avatar: 'https://avatar.png', bot: false, createdAt: now, discriminator: '1234', id: 'user1', tag: 'foo#1234', username: 'foo' };
  const message: DiscordMessage = { id: 'msg1', createdAt: now, deletable: true, content: '', attachments: [], author: user, channel: { id: 'channel1', type: 'text', createdAt: now } };

  const calendar = academicCalendarService(mockLogger(), academicWeeksParser(), academicDeadlinesParser());
  const { onBotStart, onMessage, onMemberJoin, onReactionAdd, onReactionRemove } = discordCommandHandler(config, mockLogger(), calendar);

  it('should return some cache and react actions on bot start', async () => {
    const actions = await Promise.all(onBotStart());
    expect(actions.flat()).toContainEqual({ type: BotActionType.CacheMessage, channelId: 'channel1', messageId: 'msg3' });
    expect(actions.flat()).toContainEqual({ type: BotActionType.AddReaction, channelId: 'channel2', messageId: 'msg2', emoji: 'emoji2' });
  });

  it('should do nothing when a non-command message is send', async () => {
    const actions = await Promise.all(onMessage({ ...message, content: 'hello world' }));
    expect(actions.flat()).toEqual([]);
  });

  it('should run a cowsay command', async () => {
    const actions = await Promise.all(onMessage({ ...message, content: '!cowsay moo' }));
    expect(actions.flat()).toMatchObject([{ type: BotActionType.Message, channelId: message.channel.id }]);
  });

  it('should react to a welcome message', async () => {
    const actions = await Promise.all(onMessage({ ...message, content: 'welcome foo!', channel: { ...message.channel, id: config.modules.welcomer.channel } }));
    expect(actions.flat()).toEqual([{ type: BotActionType.AddReaction, messageId: 'msg1', channelId: config.modules.welcomer.channel, emoji: '👋' }]);
  });

  it('should send a welcome message when a member joins', async () => {
    const actions = await Promise.all(onMemberJoin(user));
    expect(actions.flat()).toMatchObject([
      { type: BotActionType.EmbeddedMessage, channelId: config.modules.welcomer.channel },
      { type: BotActionType.DirectMessage, userId: user.id },
    ]);
  });

  it('should grant a role when a user reacts', async () => {
    const actions = await Promise.all(onReactionAdd({ count: 1, emoji: { id: 'react123', name: 'emoji1' }, message }, user));
    expect(actions.flat()).toMatchObject([{ type: BotActionType.RoleGrant, user, role: 'role1' }]);
  });

  it('should revoke a role when a user reacts', async () => {
    const actions = await Promise.all(onReactionRemove({ count: 1, emoji: { id: 'react123', name: 'emoji1' }, message }, user));
    expect(actions.flat()).toMatchObject([{ type: BotActionType.RoleRevoke, user, role: 'role1' }]);
  });
});
