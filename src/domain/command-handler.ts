import { EventEmitter } from 'events';
import { AcademicCalendarService } from '../academic-calendar/types';
import { LoggingService } from '../utils/logging';
import { BotAction, BotActionType } from './action-types';
import { announcerModule } from './announcer/announcer';
import { BotConfig } from './config';
import { cowsayModule } from './cowsay/cowsay';
import { DiscordCommandHandler, DiscordMessage, DiscordReaction, DiscordUser } from './discord-types';
import { reactRolesModule } from './react-roles/react-roles';
import { welcomerModule } from './welcomer/welcomer';

export const discordCommandHandler = (config: BotConfig, logger: LoggingService, calendar: AcademicCalendarService): DiscordCommandHandler => {
  const isCommand = (module: { prefix: string }, msg: string) => msg.startsWith(`${config.prefix}${module.prefix}`);

  const emitter = new EventEmitter();

  const announcer = announcerModule(config.modules.announcer, calendar);
  announcer.registerWeeklyAnnouncement((action) => emitter.emit('action', action));

  return {
    registerEventListener: (listener) => {
      emitter.on('action', listener);
    },
    onMessage: async (message: DiscordMessage): Promise<BotAction> => {
      const cowsay = cowsayModule(config.modules.cowsay);
      if (isCommand(cowsay, message.content)) {
        const resp = cowsay.say(message.content);
        return {
          type: BotActionType.Message,
          channelId: message.channel.id,
          messageContent: resp,
        };
      }

      const welcomer = welcomerModule(config.modules.welcomer);
      if (message.channel.id === config.modules.welcomer.channel) {
        return welcomer.waveAtUser(message);
      }

      return { type: BotActionType.Nothing };
    },
    onMemberJoin: async (user: DiscordUser) => {
      const welcomer = welcomerModule(config.modules.welcomer);
      return welcomer.welcomeUser(user);
    },
    onReactionAdd: async (reaction: DiscordReaction, user: DiscordUser) => {
      const roleReacts = reactRolesModule(config.modules.reactRoles, config.units, config.guild);
      return roleReacts.grantRole(user, reaction);
    },
    onReactionRemove: async (reaction: DiscordReaction, user: DiscordUser) => {
      const roleReacts = reactRolesModule(config.modules.reactRoles, config.units, config.guild);
      return roleReacts.revokeRole(user, reaction);
    },
  };
};
