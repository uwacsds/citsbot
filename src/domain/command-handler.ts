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
  const announcer = announcerModule(config.modules.announcer, logger, calendar);
  const welcomer = welcomerModule(config.modules.welcomer, logger);
  const cowsay = cowsayModule(config.modules.cowsay, logger);
  const roleReacts = reactRolesModule(config.modules.reactRoles, logger, config.units, config.guild);
 
  const emitter = new EventEmitter();
  const isCommand = (module: { prefix: string }, msg: string) => msg.startsWith(`${config.prefix}${module.prefix}`);
  announcer.registerWeeklyAnnouncement((action) => emitter.emit('action', action));

  return {
    registerEventListener: (listener) => emitter.on('action', listener),
    onMemberJoin: async (user: DiscordUser) => welcomer.welcomeUser(user),
    onReactionAdd: async (reaction: DiscordReaction, user: DiscordUser) => roleReacts.grantRole(user, reaction),
    onReactionRemove: async (reaction: DiscordReaction, user: DiscordUser) => roleReacts.revokeRole(user, reaction),
    onMessage: async (message: DiscordMessage): Promise<BotAction> => {
      if (isCommand(cowsay, message.content)) return cowsay.say(message);
      if (message.channel.id === config.modules.welcomer.channel) return welcomer.waveAtUser(message);
      return { type: BotActionType.Nothing };
    },
  };
};
