import { BotAction, BotEmbeddedMessageAction } from './action-types';
import { DiscordMessage, DiscordReaction, DiscordUser } from './discord-types';

export enum ModuleType {
  Cowsay,
  Welcomer,
  ReactRoles,
  StackOverflow,
  Announcer,
  AnimeDetector,
}

export interface BaseModule {
  type: ModuleType;
  onMemberJoin?: (user: DiscordUser) => Promise<BotAction[]>;
  onReactionAdd?: (reaction: DiscordReaction, user: DiscordUser) => Promise<BotAction[]>;
  onReactionRemove?: (reaction: DiscordReaction, user: DiscordUser) => Promise<BotAction[]>;
  onMessage?: (message: DiscordMessage) => Promise<BotAction[]>;
}

export interface CowsayModule extends BaseModule {
  type: ModuleType.Cowsay;
  onMessage: (message: DiscordMessage) => Promise<BotAction[]>;
}

export interface WelcomerModule extends BaseModule {
  type: ModuleType.Welcomer;
  onMemberJoin: (user: DiscordUser) => Promise<BotAction[]>;
  onMessage: (message: DiscordMessage) => Promise<BotAction[]>;
}

export interface ReactRolesModule extends BaseModule {
  type: ModuleType.ReactRoles;
  onReactionAdd: (reaction: DiscordReaction, user: DiscordUser) => Promise<BotAction[]>;
  onReactionRemove: (reaction: DiscordReaction, user: DiscordUser) => Promise<BotAction[]>;
}

export interface AnnouncerModule extends BaseModule {
  type: ModuleType.Announcer;
  announce: (now: () => Date) => Promise<BotEmbeddedMessageAction>;
  registerWeeklyAnnouncement: (listener: (message: BotAction[]) => void) => void;
}

export interface AnimeDetectorModule extends BaseModule {
  type: ModuleType.AnimeDetector;
  onMessage: (message: DiscordMessage) => Promise<BotAction[]>;
}

export type BotModule = CowsayModule | WelcomerModule | ReactRolesModule | AnnouncerModule | AnimeDetectorModule;
