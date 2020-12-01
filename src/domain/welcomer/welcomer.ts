import { LoggingService } from '../../utils/logging';
import { BotActionType } from '../action-types';
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
  };
}

/*
Welcome DM architecture:
Return array of actions
Actions can now have delays and conditions
Once an actions delay has elapsed its condition function is checked and it may be applied
The condition function is given a discord client object?
Maybe a list of preset tests instead of the raw object?
*/

export const welcomerModule = (config: WelcomerConfig, { log }: LoggingService): WelcomerModule => ({
  type: ModuleType.Welcomer,
  onMemberJoin: async (user: DiscordUser) => {
    log('info', 'Sending a welcome message', { title: 'Welcomer', image: user.avatar, data: { user } });
    return [
      {
        type: BotActionType.EmbeddedMessage,
        channelId: config.channel,
        embed: {
          title: 'Hello, world!',
          description: `Hey, ${user.username}`,
          colour: '#0864a5',
          thumbnail: user.avatar,
          fields: [{ name: 'Hot tip', value: 'Check out the rules at #overview' }],
          footer: { iconUrl: user.avatar, text: `Joined • ${new Date().toDateString()}` },
        },
      },
      {
        type: BotActionType.DirectMessage,
        guildId: '',
        userId: '',
        messageContent: '',
      },
    ];
  },
  onMessage: async (message: DiscordMessage) => {
    if (message.channel.id !== config.channel) return [];
    log('info', 'Waving at welcome message', { title: 'Welcomer', data: { message } });
    return [{
      type: BotActionType.AddReaction,
      channelId: message.channel.id,
      messageId: message.id,
      emoji: config.newMemberDm.react,
    }];
  },
});
