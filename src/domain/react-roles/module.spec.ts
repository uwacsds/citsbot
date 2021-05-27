import { DiscordUser, DiscordReaction } from '../../discord/types';
import { mockLogger } from '../../utils/logging';
import { BotActionType } from '../action-types';
import { UnitConfig } from '../config';
import { ReactRolesConfig } from './config';
import { reactRolesModule } from './module';

describe('react roles module', () => {
  const now = new Date('2020-01-01T00:00Z');
  const config: ReactRolesConfig = {
    messages: [
      { id: 'msg1', channel: 'channel1', reactions: [{ role: 'role1', emoji: 'emoji1' }] },
      { id: 'msg2', channel: 'channel2', reactions: [{ role: 'role2', emoji: 'emoji2' }, { role: 'role3', emoji: 'emoji3' }] },
      { id: 'msg3', channel: 'channel1', reactions: [{ unit: 'unit1', emoji: 'emoji3' }] },
    ],
  };
  const units: Record<string, UnitConfig> = { unit1: { channels: { general: '', resources: '' }, name: 'unitOne', role: 'unit1Role' } };
  const reactRoles = reactRolesModule(config, mockLogger(), units);
  const user: DiscordUser = { avatar: 'https://avatar.png', bot: false, createdAt: now, discriminator: '1234', id: 'user1', tag: 'userA#1234', username: 'userA' };

  test('given config > when handle bot start > should dispatch expected cache message and add reaction actions', async () => {
    await expect(reactRoles.onBotStart()).resolves.toEqual([
      { type: BotActionType.CacheMessage, channelId: 'channel1', messageId: 'msg1' },
      { type: BotActionType.CacheMessage, channelId: 'channel2', messageId: 'msg2' },
      { type: BotActionType.CacheMessage, channelId: 'channel1', messageId: 'msg3' },
      { type: BotActionType.AddReaction, channelId: 'channel1', messageId: 'msg1', emoji: 'emoji1' },
      { type: BotActionType.AddReaction, channelId: 'channel2', messageId: 'msg2', emoji: 'emoji2' },
      { type: BotActionType.AddReaction, channelId: 'channel2', messageId: 'msg2', emoji: 'emoji3' },
      { type: BotActionType.AddReaction, channelId: 'channel1', messageId: 'msg3', emoji: 'emoji3' },
    ]);
  });

  test('given role configured > when handle reaction add > should dispatch role grant', async () => {
    const reaction = { emoji: { name: 'emoji1' }, message: { id: 'msg1', channel: { id: 'channel1' } } } as DiscordReaction;
    await expect(reactRoles.onReactionAdd(reaction, user)).resolves.toEqual([{ type: BotActionType.RoleGrant, user, role: 'role1' }]);
  });

  test('given unit configured > when handle reaction add > should dispatch role grant', async () => {
    const reaction = { emoji: { name: 'emoji3' }, message: { id: 'msg3', channel: { id: 'channel1' } } } as DiscordReaction;
    await expect(reactRoles.onReactionAdd(reaction, user)).resolves.toEqual([{ type: BotActionType.RoleGrant, user, role: 'unit1Role' }]);
  });

  test('given channel not configured > when handle reaction add > should dispatch no actions', async () => {
    const reaction = { emoji: { name: 'emoji1' }, message: { channel: { id: 'channelBad' }, id: 'msg3' } } as DiscordReaction;
    await expect(reactRoles.onReactionAdd(reaction, user)).resolves.toEqual([]);
  });

  test('given message not configured > when handle reaction add > should dispatch no actions', async () => {
    const reaction = { emoji: { name: 'emoji1' }, message: { channel: { id: 'channel3' }, id: 'msgBad' } } as DiscordReaction;
    await expect(reactRoles.onReactionAdd(reaction, user)).resolves.toEqual([]);
  });

  test('given valid config > when handle reaction remove > should dispatch role remove', async () => {
    const reaction = { emoji: { name: 'emoji3' }, message: { channel: { id: 'channel1' }, id: 'msg3' } } as DiscordReaction;
    await expect(reactRoles.onReactionRemove(reaction, user)).resolves.toEqual([{ type: BotActionType.RoleRevoke, user, role: 'unit1Role' }]);
  });

  test('given react not configured > when handle reaction remove > should dispatch no actions', async () => {
    const reaction = { emoji: { name: 'emoji1' }, message: { channel: { id: 'channel3' }, id: 'msgBad' } } as DiscordReaction;
    await expect(reactRoles.onReactionRemove(reaction, user)).resolves.toEqual([]);
  });

  test('given unknown reaction on tracked message > when handle reaction add > should dispatch reaction remove', async () => {
    const reaction = { emoji: { id: 'react123', name: 'badEmoji' }, message: { channel: { id: 'channel2' }, id: 'msg2' } } as DiscordReaction;
    await expect(reactRoles.onReactionAdd(reaction, user)).resolves.toEqual([{ type: BotActionType.RemoveReaction, channelId: 'channel2', messageId: 'msg2', reactionId: 'react123' }]);
  });
});
