import { AnnouncerModule, CowsayModule, ModuleType } from '../module-types';

export interface AnnouncerConfig {
  channel: string;
  crontab: string;
}

export const announcerModule = (config: AnnouncerConfig): AnnouncerModule => ({
  type: ModuleType.Announcer,
  registerWeeklyAnnouncement: (listener) => {
    
  },
});
