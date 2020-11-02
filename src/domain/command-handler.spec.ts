/* eslint-disable @typescript-eslint/no-explicit-any */
import { academicCalendarService } from '../academic-calendar/academic-calendar-service';
import { BotActionType } from './action-types';
import { discordCommandHandler } from './command-handler';
import { BotConfig } from './config';
import { DiscordUser } from './discord-types';

describe('command-handler', () => {
    const now = new Date('2020-01-01T00:00Z');
    const config: BotConfig = {
        guild: 'guild_1', logChannel: 'ch_logs', prefix: '!',
        units: {
            unit1: { channels: { general: '', resources: '' }, name: 'unit_1', role: 'role_unit1' },
        },
        modules: {
            announcer: { channel: 'ch_announcer', crontab: '* * * * * *' },
            cowsay: { cowArt: 'art', lineMaxLen: 40 },
            welcomer: { channel: 'ch_welcome', newMemberDm: { delay: 10, instantAccountAge: 10, message: 'msg', react: 'emoji', roleThreshold: 1 } },
            reactRoles: {
                messages: [
                    { id: 'msg1', channel: 'channel1', reactions: [{ role: 'role1', emoji: 'emoji1' }] },
                    { id: 'msg2', channel: 'channel2', reactions: [{ role: 'role2', emoji: 'emoji2' }] },
                    { id: 'msg3', channel: 'channel1', reactions: [{ unit: 'unit1',emoji: 'emoji3' }] },
                ],
            },
        },
    };
    const user: DiscordUser = { avatar: 'https://avatar.png', bot: false, createdAt: now, discriminator: '1234', id: 'user1', tag: 'foo#1234', username: 'foo' };
    const calendar = academicCalendarService();
    const { onMessage, onMemberJoin, onReactionAdd, onReactionRemove } = discordCommandHandler(config, calendar);

    it('should do nothing when a non-command message is send', () => {
        const res = onMessage({ content: 'hello world', channel: { id: 'ch1' } } as any);
        expect(res).toMatchObject({ type: BotActionType.Nothing });
    });

    it('should run a cowsay command', () => {
        const res = onMessage({ content: '!cowsay moo',channel: { id: 'ch1' } } as any);
        expect(res).toMatchObject({ type: BotActionType.Message, channelId: 'ch1' });
    });

    it('should react to a welcome message', () => {
        const res = onMessage({ content: 'welcome foo!', channel: { id: config.modules.welcomer.channel }, id: 'msg1' } as any);
        expect(res).toMatchObject({ type: BotActionType.AddReaction, messageId: 'msg1', channelId: config.modules.welcomer.channel, emoji: config.modules.welcomer.newMemberDm.react });
    });

    it('should send a welcome message when a member joins', () => {
        const res = onMemberJoin(user);
        expect(res).toMatchObject({ type: BotActionType.EmbeddedMessage, channelId: config.modules.welcomer.channel });
    });

    it('should grant a role when a user reacts', () => {
        const res = onReactionAdd(
            { 
                count: 1, emoji: { name: 'emoji1' }, 
                message: { 
                    id: 'msg1', author: null as never, content: '', createdAt: now, deletable: true,
                    channel: { createdAt: now, id: 'channel1', type: 'text' }, 
                }, 
            },
            user,
        );
        expect(res).toMatchObject({ type: BotActionType.RoleGrant, guild: 'guild_1', user, role: 'role1' });
    });

    it('should revoke a role when a user reacts', () => {
        const res = onReactionRemove(
            {
                count: 1, emoji: { name: 'emoji1' }, 
                message: {
                    id: 'msg1', author: null as never, content: '', createdAt: now, deletable: true,
                    channel: { createdAt: now, id: 'channel1', type: 'text' },
                },
            },
            user,
        );
        expect(res).toMatchObject({ type: BotActionType.RoleRevoke, guild: 'guild_1', user, role: 'role1' });
    });
});
