import { scheduleJob } from 'node-schedule';
import {
  AcademicCalendar,
  AcademicCalendarService,
  AcademicWeek,
  TeachingAcademicWeek,
} from '../../academic-calendar/types';
import { getWeekIndex } from '../../academic-calendar/week';
import { LoggingService } from '../../utils/logging';
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

const currentSemester = (date: Date) => (date.getUTCMonth() > 6 ? 2 : 1);

const currentSeason = (date: Date): Season => {
  const month = date.getUTCMonth() + 1;
  return month >= 6 && month < 9 ? 'Winter' : 'Summer';
};

const getWeek = (calendar: AcademicCalendar, date: Date): AcademicWeek =>
  calendar.weeks[getWeekIndex(date)] ?? { type: 'unknown', deadlines: [] };

const weeksBetween = (start: Date, end: Date): number => {
  const diff = (end.getTime() - start.getTime()) / 1000;
  return Math.abs(Math.round(diff / (60 * 60 * 24 * 7)));
};

const weeksUntilNextSemester = (calendar: AcademicCalendar, now: Date): number => {
  const sem1Week1 = Object.values(calendar.weeks).find(
    (week) => week.type === 'teaching' && week.semester === 1 && week.week === 1
  ) as TeachingAcademicWeek;
  const sem2Week1 = Object.values(calendar.weeks).find(
    (week) => week.type === 'teaching' && week.semester === 2 && week.week === 1
  ) as TeachingAcademicWeek;
  if (sem1Week1?.type !== 'teaching') throw Error('Academic calendar missing first week of semester 1');
  if (sem2Week1?.type !== 'teaching') throw Error('Academic calendar missing first week of semester 2');
  if (now < sem1Week1.date) return weeksBetween(now, sem1Week1.date);
  if (now < sem2Week1.date) return weeksBetween(now, sem2Week1.date);
  const yearStart = new Date(`${now.getUTCFullYear()}-01-01Z00:00+00:00`);
  const yearEnd = new Date(`${now.getUTCFullYear()}-12-31Z00:00+00:00`);
  return weeksBetween(now, yearEnd) + weeksBetween(yearStart, sem1Week1.date);
};

export const announcerModule = (
  config: AnnouncerConfig,
  { log }: LoggingService,
  calendarService: AcademicCalendarService
): AnnouncerModule => {
  const buildEmbed = (
    title: string,
    description?: string,
    events: { name: string; value: string; inline?: boolean }[] = []
  ): BotEmbeddedMessageAction => ({
    type: BotActionType.EmbeddedMessage,
    channelId: config.channel,
    embed: {
      title,
      description,
      fields: events,
      colour: config.colour,
      image: config.image,
      footer: {
        text: config.disclaimer,
      },
    },
  });

  const announce = async (now = () => new Date()): Promise<BotEmbeddedMessageAction> => {
    const calendar = await calendarService.fetchCalendar();
    const week = getWeek(calendar, now());
    switch (week.type) {
      case 'teaching': {
        const title = `Welcome to Week ${week.week} of Semester ${week.semester}`;
        const events = week.deadlines.map(({ unit, title, date }) => ({
          name: `📝 ${unit}`,
          value: `${title}, ${date.toLocaleString('en-AU', { timeZone: 'Australia/Perth' })}`,
        }));
        const description = events.length > 0 ? 'Here are some things happening this week' : undefined;
        log('info', 'Announcing teaching week', { title: 'Announcer', data: { week } });
        return buildEmbed(title, description, events);
      }
      case 'study-break':
        log('info', 'Announcing study break week', { title: 'Announcer', data: { week } });
        return buildEmbed(`Welcome to Semester ${currentSemester(now())} Study Break`);
      case 'exam':
        log('info', 'Announcing exam week', { title: 'Announcer', data: { week } });
        return buildEmbed(`Welcome to Semester ${currentSemester(now())} Exams`);
      default: {
        const title = `${currentSeason(now())} Vacation`;
        const description = [
          `📅 ${weeksUntilNextSemester(calendar, now())} weeks left until next semester`,
          '📝 Enrolment details: https://www.uwa.edu.au/students/my-course/enrolment',
        ].join('\n\n');
        log('info', 'Announcing vacation week', { title: 'Announcer', data: { week } });
        return buildEmbed(title, description);
      }
    }
  };

  return {
    type: ModuleType.Announcer,
    announce,
    registerWeeklyAnnouncement: (listener) => {
      scheduleJob('announcer', config.crontab, async () => {
        listener(await announce());
      });
    },
  };
};
