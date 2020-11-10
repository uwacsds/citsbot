import { scheduleJob } from 'node-schedule';
import { AcademicCalendar, AcademicCalendarService, AcademicWeek } from '../../academic-calendar/types';
import { BotActionType, BotEmbeddedMessageAction } from '../action-types';
import { AnnouncerModule, ModuleType } from '../module-types';

type Season = 'Summer' | 'Winter';

export interface AnnouncerConfig {
  channel: string;
  crontab: string;
  disclaimer: string;
  image: string;
  colour: string;
}

const currentSemester = (now = () => new Date()) => (now().getUTCMonth() > 6 ? 2 : 1);

const currentSeason = (now = () => new Date()): Season => {
  const month = now().getMonth();
  return month >= 6 && month < 9 ? 'Winter' : 'Summer';
};

const lastMonday = (date: Date) => {
  let monday = new Date(date);
  monday.setUTCDate(monday.getUTCDate() - monday.getUTCDay() + 1);
  return monday;
};

const getWeek = (calendar: AcademicCalendar, now = () => new Date()): AcademicWeek =>
  calendar.weeks[lastMonday(now()).toJSON()] ?? { type: 'unknown' };

export const announcerModule = (config: AnnouncerConfig, calendarService: AcademicCalendarService): AnnouncerModule => {
  const makeAnnouncement = async (): Promise<BotEmbeddedMessageAction> => {
    const calendar = await calendarService.fetchCalendar();
    const week = getWeek(calendar);

    let title = 'UNKNOWN_TITLE';
    let description = '';
    switch (week.type) {
      case 'teaching':
        title = `Welcome to Week ${week.week} of Semester ${week.semester}`;
        break;
      case 'study-break':
        title = `Welcome to Semester ${currentSemester()} Study Break`;
        break;
    }
    return {
      type: BotActionType.EmbeddedMessage,
      channelId: config.channel,
      embed: {
        title,
        description,
        colour: config.colour,
        image: config.image,
        footer: {
          text: config.disclaimer,
        },
      },
    };
  };

  return {
    type: ModuleType.Announcer,
    makeAnnouncement,
    registerWeeklyAnnouncement: (listener) => {
      scheduleJob('announcer', config.crontab, async () => {
        listener(await makeAnnouncement());
      });
    },
  };
};
