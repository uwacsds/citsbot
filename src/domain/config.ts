import { promises as fs } from 'fs';
import { AnimeDetectorConfig } from './anime-detector/anime-detector';
import { AnnouncerConfig } from './announcer/announcer';
import { CowsayConfig } from './cowsay/cowsay';
import { ReactRolesConfig } from './react-roles/react-roles';
import { WelcomerConfig } from './welcomer/welcomer';

export interface UnitsConfig {
  [key: string]: {
    name: string;
    role: string;
    channels: {
      general: string;
      resources: string;
    };
  };
}

export interface BotConfig {
  prefix: string;
  guild: string;
  logChannel: string;
  units: UnitsConfig;
  modules: {
    cowsay: CowsayConfig;
    welcomer: WelcomerConfig;
    announcer: AnnouncerConfig;
    reactRoles: ReactRolesConfig;
    animeDetector: AnimeDetectorConfig;
  };
}
