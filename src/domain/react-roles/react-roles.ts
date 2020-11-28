import { LoggingService } from '../../utils/logging';
import { BotActionType } from '../action-types';
import { UnitsConfig } from '../config';
import { DiscordUser, DiscordReaction } from '../discord-types';
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

const getRole = (config: ReactRolesConfig, units: UnitsConfig, reaction: DiscordReaction) => {
  const msg = config.messages.find((msg) => msg.id === reaction.message.id);
  if (!msg) return null;

  const roleConfig = msg.reactions.find((r) => r.emoji === reaction.emoji.name);
  if (roleConfig?.role) return roleConfig.role;

  const unitConfig = Object.entries(units).find(([code, _]) => code === roleConfig?.unit);
  if (!unitConfig) return null;
  const [_, unit] = unitConfig;
  return unit.role;
};

export const reactRolesModule = (
  config: ReactRolesConfig,
  { log }: LoggingService,
  units: UnitsConfig,
  guild: string
): ReactRolesModule => ({
  type: ModuleType.ReactRoles,
  onReactionAdd: async (reaction: DiscordReaction, user: DiscordUser) => {
    const role = getRole(config, units, reaction);
    if (!role) return { type: BotActionType.Nothing };
    log('info', 'Granting role', { title: 'React Roles', data: { role, emoji: reaction.emoji, user } });
    return { type: BotActionType.RoleGrant, guild, user, role };
  },
  onReactionRemove: async (reaction: DiscordReaction, user: DiscordUser) => {
    const role = getRole(config, units, reaction);
    if (!role) return { type: BotActionType.Nothing };
    log('info', 'Revoking role', { title: 'React Roles', data: { role, emoji: reaction.emoji, user } });
    return { type: BotActionType.RoleRevoke, guild, user, role };
  },
});
