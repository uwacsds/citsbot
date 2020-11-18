import { LoggingService } from '../../utils/logging';
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
  };
}

export const welcomerModule = (config: WelcomerConfig, { log }: LoggingService): WelcomerModule => ({
  type: ModuleType.Welcomer,
  welcomeUser: (user: DiscordUser): BotEmbeddedMessageAction => {
    log('info', 'Sending a welcome message', { title: 'Welcomer', image: user.avatar, data: { user } });
    return {
      type: BotActionType.EmbeddedMessage,
      channelId: config.channel,
      embed: {
        title: 'Hello, world!',
        description: `Hey, ${user.username}`,
        colour: '#0864a5',
        thumbnail: user.avatar,
        fields: [
          {
            name: 'Hot tip',
            value: 'Check out the rules at #overview',
          },
        ],
        footer: {
          text: `Joined • ${new Date().toDateString()}`,
          iconUrl: user.avatar,
        },
      },
    };
  },
  waveAtUser: (message: DiscordMessage): BotAction => {
    log('info', 'Waving at welcome message', { title: 'Welcomer', data: { message } });
    return {
      type: BotActionType.AddReaction,
      channelId: message.channel.id,
      messageId: message.id,
      emoji: config.newMemberDm.react,
    };
  },
});
