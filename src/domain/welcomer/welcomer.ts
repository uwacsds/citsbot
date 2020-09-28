import { BotAction, BotActionType, BotEmbeddedMessageAction } from '../action-types';
import { DiscordMessage, DiscordUser } from '../discord-types';
import { ModuleType, WelcomerModule } from '../module-types';

export interface WelcomerConfig {
    channel: string;
    newMemberDm: {
        delay: number;
        roleThreshold: number;
        instantAccountAge: number;
        message: string;
        react: string;
    }
}

export const welcomerModule = (config: WelcomerConfig): WelcomerModule => ({
    type: ModuleType.Welcomer,
    welcomeUser: (user: DiscordUser): BotEmbeddedMessageAction => ({
        type: BotActionType.EmbeddedMessage,
        channelId: config.channel,
        embed: {
            title: 'Hello, world!',
            description: `Hey, ${user.username}`,
            colour: '#0864a5',
            thumbnail: user.avatar,
            fields: [{
                name: 'Hot tip',
                value: 'Check out the rules at #overview',
            }],
            footer: {
                text: `Joined • ${new Date().toDateString()}`,
                iconUrl: user.avatar,
            },
        },
    }),
    waveAtUser: (message: DiscordMessage): BotAction => ({
        type: BotActionType.AddReaction,
        channelId: message.channel.id,
        messageId: message.id,
        emoji: config.newMemberDm.react,
    }),
});
