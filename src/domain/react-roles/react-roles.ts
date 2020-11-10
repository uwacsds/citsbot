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
  if (roleConfig?.role) {
    return roleConfig.role;
  }

  const unitConfig = Object.entries(units).find(([code, _]) => code === roleConfig?.unit);
  if (!unitConfig) return null;
  const [_, unit] = unitConfig;
  return unit.role;
};

export const reactRolesModule = (config: ReactRolesConfig, units: UnitsConfig, guild: string): ReactRolesModule => ({
  type: ModuleType.ReactRoles,
  grantRole: (user: DiscordUser, reaction: DiscordReaction) => {
    const role = getRole(config, units, reaction);
    if (!role) return { type: BotActionType.Nothing };
    return {
      type: BotActionType.RoleGrant,
      guild,
      user: user,
      role,
    };
  },
  revokeRole: (user: DiscordUser, reaction: DiscordReaction) => {
    const role = getRole(config, units, reaction);
    if (!role) return { type: BotActionType.Nothing };
    return {
      type: BotActionType.RoleRevoke,
      guild,
      user: user,
      role,
    };
  },
});