import { EventEmitter } from 'events';
import { AcademicCalendarService } from '../academic-calendar/types';
import { LoggingService } from '../utils/logging';
import { BotAction } from './action-types';
import { animeDetectorModule } from './anime-detector/anime-detector';
import { announcerModule } from './announcer/announcer';
import { BotConfig } from './config';
import { cowsayModule } from './cowsay/cowsay';
import { DiscordMessage, DiscordReaction, DiscordUser } from '../discord-service/types';
import { reactRolesModule } from './react-roles/react-roles';
import { welcomerModule } from './welcomer/welcomer';

export interface DiscordCommandHandler {
  registerEventListener: (listener: (action: BotAction) => void) => void;
  onBotStart: () => Promise<BotAction[]>[];
  onMessage: (message: DiscordMessage) => Promise<BotAction[]>[];
  onMemberJoin: (user: DiscordUser) => Promise<BotAction[]>[];
  onReactionAdd: (reaction: DiscordReaction, user: DiscordUser) => Promise<BotAction[]>[];
  onReactionRemove: (reaction: DiscordReaction, user: DiscordUser) => Promise<BotAction[]>[];
}

export const discordCommandHandler = (config: BotConfig, logger: LoggingService, calendar: AcademicCalendarService): DiscordCommandHandler => {
  const announcer = announcerModule(config.modules.announcer, logger, calendar);
  const welcomer = welcomerModule(config.modules.welcomer, logger);
  const cowsay = cowsayModule(config, logger);
  const roleReacts = reactRolesModule(config.modules.reactRoles, logger, config.units);
  const animeDetector = animeDetectorModule(config.modules.animeDetector, logger);

  const emitter = new EventEmitter();
  announcer.registerWeeklyAnnouncement(action => emitter.emit('action', action));

  const modules = [announcer, welcomer, cowsay, roleReacts, animeDetector];

  return {
    registerEventListener: listener => emitter.on('action', listener),
    onBotStart: () => modules.flatMap(module => module.onBotStart?.() ?? []),
    onMemberJoin: (user: DiscordUser) => modules.flatMap(module => module.onMemberJoin?.(user) ?? []),
    onReactionAdd: (reaction: DiscordReaction, user: DiscordUser) => modules.flatMap(module => module.onReactionAdd?.(reaction, user) ?? []),
    onReactionRemove: (reaction: DiscordReaction, user: DiscordUser) => modules.flatMap(module => module.onReactionRemove?.(reaction, user) ?? []),
    onMessage: (message: DiscordMessage) => modules.flatMap(module => module.onMessage?.(message) ?? []),
  };
};
