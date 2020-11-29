import { EventEmitter } from 'events';
import { AcademicCalendarService } from '../academic-calendar/types';
import { LoggingService } from '../utils/logging';
import { BotActionType, BotNothingAction } from './action-types';
import { animeDetectorModule } from './anime-detector/anime-detector';
import { announcerModule } from './announcer/announcer';
import { BotConfig } from './config';
import { cowsayModule } from './cowsay/cowsay';
import { DiscordCommandHandler, DiscordMessage, DiscordReaction, DiscordUser } from './discord-types';
import { reactRolesModule } from './react-roles/react-roles';
import { welcomerModule } from './welcomer/welcomer';

const noAction = (): Promise<BotNothingAction> => new Promise(resolve => resolve({ type: BotActionType.Nothing }));

export const discordCommandHandler = (config: BotConfig, logger: LoggingService, calendar: AcademicCalendarService): DiscordCommandHandler => {
  const announcer = announcerModule(config.modules.announcer, logger, calendar);
  const welcomer = welcomerModule(config.modules.welcomer, logger);
  const cowsay = cowsayModule(config, logger);
  const roleReacts = reactRolesModule(config.modules.reactRoles, logger, config.units, config.guild);
  const animeDetector = animeDetectorModule(config.modules.animeDetector, logger);

  const emitter = new EventEmitter();
  announcer.registerWeeklyAnnouncement(action => emitter.emit('action', action));

  const modules = [announcer, welcomer, cowsay, roleReacts, animeDetector];

  return {
    registerEventListener: listener => emitter.on('action', listener),
    onMemberJoin: (user: DiscordUser) => modules.map(module => module.onMemberJoin?.(user) ?? noAction()),
    onReactionAdd: (reaction: DiscordReaction, user: DiscordUser) => modules.map(module => module.onReactionAdd?.(reaction, user) ?? noAction()),
    onReactionRemove: (reaction: DiscordReaction, user: DiscordUser) => modules.map(module => module.onReactionRemove?.(reaction, user) ?? noAction()),
    onMessage: (message: DiscordMessage) => modules.map(module => module.onMessage?.(message) ?? noAction()),
  };
};
