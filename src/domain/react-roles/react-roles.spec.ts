import { mockLogger } from '../../utils/logging';
import { BotActionType } from '../action-types';
import { UnitsConfig } from '../config';
import { DiscordReaction, DiscordUser } from '../discord-types';
import { ReactRolesConfig, reactRolesModule } from './react-roles';

describe('react-roles module', () => {
  const now = new Date('2020-01-01T00:00Z');
  const config: ReactRolesConfig = {
    messages: [
      { id: 'msg1', channel: 'channel1', reactions: [{ role: 'role1', emoji: 'emoji1' }] },
      { id: 'msg2', channel: 'channel2', reactions: [{ role: 'role2', emoji: 'emoji2' }] },
      { id: 'msg3', channel: 'channel1', reactions: [{ unit: 'unit1', emoji: 'emoji3' }] },
    ],
  };
  const units: UnitsConfig = {
    unit1: { channels: { general: '', resources: '' }, name: 'unitOne', role: 'unit1Role' },
  };
  const reactRoles = reactRolesModule(config, mockLogger(), units, 'guild1');
  const user: DiscordUser = {
    avatar: 'https://avatar.png',
    bot: false,
    createdAt: now,
    discriminator: '1234',
    id: 'user1',
    tag: 'userA#1234',
    username: 'userA',
  };

  it('should grant a role when given a valid configRole based react', async () => {
    const reaction = {
      emoji: { name: 'emoji1' },
      message: { id: 'msg1', channel: { id: 'channel1' } },
    } as DiscordReaction;
    await expect(reactRoles.onReactionAdd(reaction, user)).resolves.toEqual([{
      type: BotActionType.RoleGrant,
      user,
      role: 'role1',
      guild: 'guild1',
    }]);
  });

  it('should grant a role when given a valid unitConfig based react', async () => {
    const reaction = {
      emoji: { name: 'emoji3' },
      message: { id: 'msg3', channel: { id: 'channel1' } },
    } as DiscordReaction;
    await expect(reactRoles.onReactionAdd(reaction, user)).resolves.toEqual([{
      type: BotActionType.RoleGrant,
      user,
      role: 'unit1Role',
      guild: 'guild1',
    }]);
  });

  it('should return nothing action when unable to find a role due to invalid emoji', async () => {
    const reaction = {
      emoji: { name: 'emojiBad' },
      message: { channel: { id: 'channel1' }, id: 'msg3' },
    } as DiscordReaction;
    await expect(reactRoles.onReactionAdd(reaction, user)).resolves.toEqual([]);
  });

  it('should return nothing action when unable to find a role due to invalid channel', async () => {
    const reaction = {
      emoji: { name: 'emoji1' },
      message: { channel: { id: 'channelBad' }, id: 'msg3' },
    } as DiscordReaction;
    await expect(reactRoles.onReactionAdd(reaction, user)).resolves.toEqual([]);
  });

  it('should return nothing action when unable to find a role due to invalid message', async () => {
    const reaction = {
      emoji: { name: 'emoji1' },
      message: { channel: { id: 'channel3' }, id: 'msgBad' },
    } as DiscordReaction;
    await expect(reactRoles.onReactionAdd(reaction, user)).resolves.toEqual([]);
  });

  it('should revoke a role if the react is valid', async () => {
    const reaction = {
      emoji: { name: 'emoji3' },
      message: { channel: { id: 'channel1' }, id: 'msg3' },
    } as DiscordReaction;
    await expect(reactRoles.onReactionRemove(reaction, user)).resolves.toEqual([{
      type: BotActionType.RoleRevoke,
      user,
      role: 'unit1Role',
      guild: 'guild1',
    }]);
  });

  it('should fail to revoke a role that does not exist', async () => {
    const reaction = {
      emoji: { name: 'emoji1' },
      message: { channel: { id: 'channel3' }, id: 'msgBad' },
    } as DiscordReaction;
    await expect(reactRoles.onReactionRemove(reaction, user)).resolves.toEqual([]);
  });
});
