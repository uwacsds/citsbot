import { DiscordUser, DiscordMessage } from '../../discord/types';
import { daysBetween } from '../../utils/date';
import { LoggingService } from '../../utils/logging';
import { BotAction, BotActionType } from '../action-types';
import { BotModule } from '../types';
import { WelcomerConfig } from './config';
import { WelcomerEmitter } from './metrics';

export interface WelcomerModule extends BotModule {
  onMemberJoin: (user: DiscordUser) => Promise<BotAction[]>;
  onMessage: (message: DiscordMessage) => Promise<BotAction[]>;
}

export const welcomerModule = (
  { log }: LoggingService,
  emitter: WelcomerEmitter,
  config: WelcomerConfig,
  now = () => new Date()
): WelcomerModule => {

  const onMemberJoin = async (user: DiscordUser): Promise<BotAction[]> => {
    const isNewUser = daysBetween(user.createdAt, now()) < config.newMemberDm.instantAccountAge;
    log(`info`, `Sending a welcome message`, { title: `Welcomer`, image: user.avatar, data: { user } });
    emitter.userJoin();

    return [
      {
        type: BotActionType.EmbeddedMessage,
        channelId: config.channel,
        embed: {
          title: `Hello, world!`,
          description: `Hey, ${user.username}`,
          colour: `#0864a5`,
          thumbnail: user.avatar,
          fields: [{ name: `Hot tip`, value: `Check out the rules at #overview` }],
          footer: { iconUrl: user.avatar, text: `Joined • ${new Date().toDateString()}` },
        },
      },
      {
        type: BotActionType.DirectMessage,
        userId: user.id,
        messageContent: config.newMemberDm.message.replaceAll(`{name}`, user.username ?? ``),
        delay: isNewUser ? 0 : config.newMemberDm.delay,
        condition: async ({ fetchMember }) => {
          const member = await fetchMember(user.id);
          const roleCountBelowThreshold = member.roles.cache.size < config.newMemberDm.roleThreshold;
          if (roleCountBelowThreshold) emitter.directMessageSent(isNewUser);
          return roleCountBelowThreshold;
        },
      },
    ];
  };

  const onMessage = async (message: DiscordMessage): Promise<BotAction[]> => {
    if (message.channel.id !== config.channel) return [];
    log(`info`, `Waving at welcome message`, { title: `Welcomer`, data: { message } });
    
    return [
      {
        type: BotActionType.AddReaction,
        channelId: message.channel.id,
        messageId: message.id,
        emoji: `👋`,
      },
    ];
  };

  return { onMemberJoin, onMessage };
};
