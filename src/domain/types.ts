import { BotAction } from './action-types';
import { DiscordMessage, DiscordReaction, DiscordUser } from '../discord/types';

export interface BotModule {
  onBotStart?: () => Promise<BotAction[]>;
  onMemberJoin?: (user: DiscordUser) => Promise<BotAction[]>;
  onReactionAdd?: (reaction: DiscordReaction, user: DiscordUser) => Promise<BotAction[]>;
  onReactionRemove?: (reaction: DiscordReaction, user: DiscordUser) => Promise<BotAction[]>;
  onMessage?: (message: DiscordMessage) => Promise<BotAction[]>;
}
