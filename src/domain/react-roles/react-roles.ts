import { DiscordReaction, DiscordUser } from '../../discord-service/types';
import { LoggingService } from '../../utils/logging';
import { BotActionType, BotAddReactionAction } from '../action-types';
import { UnitConfig } from '../config';
import { ModuleType, ReactRolesModule } from '../module-types';

export interface ReactRolesConfig {
  messages: Array<{
    id: string;
    channel: string;
    reactions: Array<{
      role?: string;
      unit?: string;
      emoji: string;
    }>;
  }>;
}

const getRole = (config: ReactRolesConfig, units: Record<string, UnitConfig>, reaction: DiscordReaction) => {
  const msg = config.messages.find(msg => msg.id === reaction.message.id);
  if (!msg) return null;

  const roleConfig = msg.reactions.find(r => r.emoji === reaction.emoji.name);
  if (roleConfig?.role) return roleConfig.role;

  const unitConfig = Object.entries(units).find(([code, _]) => code === roleConfig?.unit);
  if (!unitConfig) return null;
  const [_, unit] = unitConfig;
  return unit.role;
};

export const reactRolesModule = (config: ReactRolesConfig, { log }: LoggingService, units: Record<string, UnitConfig>): ReactRolesModule => ({
  type: ModuleType.ReactRoles,
  onBotStart: async () => {
    const actions = config.messages.flatMap(({ reactions, channel, id }) =>
      reactions.map(({ emoji }): BotAddReactionAction => ({ type: BotActionType.AddReaction, channelId: channel, messageId: id, emoji }))
    );
    log('info', 'Initialising React Roles', { title: 'React Roles' });
    return actions;
  },
  onReactionAdd: async (reaction: DiscordReaction, user: DiscordUser) => {
    if (user.bot) return [];
    const role = getRole(config, units, reaction);
    if (!role) return [];
    log('info', 'Granting role', { title: 'React Roles', data: { role, emoji: reaction.emoji, user } });
    return [{ type: BotActionType.RoleGrant, user, role }];
  },
  onReactionRemove: async (reaction: DiscordReaction, user: DiscordUser) => {
    const role = getRole(config, units, reaction);
    if (!role) return [];
    log('info', 'Revoking role', { title: 'React Roles', data: { role, emoji: reaction.emoji, user } });
    return [{ type: BotActionType.RoleRevoke, user, role }];
  },
});
