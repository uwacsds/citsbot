import { DiscordMessage, DiscordReaction, DiscordUser } from '../../discord/types';
import { LoggingService } from '../../utils/logging';
import { BotAction, BotActionType, BotAddReactionAction, BotCacheMessageAction } from '../action-types';
import { UnitConfig } from '../config';
import { ModuleType, ReactRolesModule } from '../module-types';
import { ReactRolesConfig } from './config';

export const reactRolesModule = (
  { log }: LoggingService,
  config: ReactRolesConfig,
  units: Record<string, UnitConfig>
): ReactRolesModule => {

  const onBotStart = async (): Promise<BotAction[]> => {
    const cacheActions = config.messages.map(({ id, channel }): BotCacheMessageAction => ({ type: BotActionType.CacheMessage, channelId: channel, messageId: id }));
    const reactActions = config.messages.flatMap(({ reactions, channel, id }) => reactions.map(({ emoji }): BotAddReactionAction => ({ type: BotActionType.AddReaction, channelId: channel, messageId: id, emoji })));
    log(`info`, `Initialising React Roles`, { title: `React Roles` });
    return [...cacheActions, ...reactActions];
  };

  const onReactionAdd = async (reaction: DiscordReaction, user: DiscordUser): Promise<BotAction[]> => {
    if (user.bot) return [];
    if (!isMessageTracked(config, reaction.message)) return [];

    const role = getRole(config, units, reaction);
    if (!role) return [{ type: BotActionType.RemoveReaction, channelId: reaction.message.channel.id, messageId: reaction.message.id, reactionId: reaction.emoji.id }];

    log(`info`, `Granting role`, { title: `React Roles`, data: { role, emoji: reaction.emoji, user } });
    return [{ type: BotActionType.RoleGrant, user, role }];
  };

  const onReactionRemove = async (reaction: DiscordReaction, user: DiscordUser): Promise<BotAction[]> => {
    if (user.bot) return [];
    
    const role = getRole(config, units, reaction);
    if (!role) return [];

    log(`info`, `Revoking role`, { title: `React Roles`, data: { role, emoji: reaction.emoji, user } });
    return [{ type: BotActionType.RoleRevoke, user, role }];
  };

  return { type: ModuleType.ReactRoles, onBotStart, onReactionAdd, onReactionRemove };
};

const isMessageTracked = (config: ReactRolesConfig, message: DiscordMessage) => getMessage(config, message) !== undefined;

const getMessage = (config: ReactRolesConfig, message: DiscordMessage) => config.messages.find(({ id, channel }) => id === message.id && channel === message.channel.id);

const getRole = (config: ReactRolesConfig, units: Record<string, UnitConfig>, reaction: DiscordReaction) => {
  const msg = getMessage(config, reaction.message);
  if (!msg) return undefined;

  const roleConfig = msg.reactions.find(r => r.emoji === reaction.emoji.name);
  if (roleConfig?.role) return roleConfig.role;

  const unitConfig = Object.entries(units).find(([code, _]) => code === roleConfig?.unit);
  if (!unitConfig) return undefined;

  const [_, unit] = unitConfig;
  return unit.role;
};
