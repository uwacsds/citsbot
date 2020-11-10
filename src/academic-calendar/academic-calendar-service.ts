import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { AcademicCalendarService } from './types';

const TEACHING_WEEKS_URL = 'https://ipoint.uwa.edu.au/app/answers/detail/a_id/1405/~/2016-dates-and-teaching-weeks';

interface StudyBreakSemesterWeek {
  type: 'study-break';
}

interface TeachingSemesterWeek {
  type: 'teaching';
  semester: number;
  week: number;
}

interface TeachingAcademicWeek {
  type: 'teaching';
  date: Date;
  semester: number;
  week: number;
}

interface StudyBreakAcademicWeek {
  type: 'study-break';
  date: Date;
}

type AcademicWeek = TeachingAcademicWeek | StudyBreakAcademicWeek;

interface AcademicCalendar {
  weeks: Record<string, AcademicWeek>;
}

const parseSemesterWeek = (str: string): StudyBreakSemesterWeek | TeachingSemesterWeek | null => {
  const result = /^Sem\s*(?<semester>\d+)\s*\/\s*Wk\s*(?<week>\d+)$|^Study\s*Break$/.exec(str.trim());
  if (result === null) return null;
  if (result.groups == undefined) {
    return { type: 'study-break' };
  }
  return {
    type: 'teaching',
    semester: Number(result.groups.semester),
    week: Number(result.groups.week),
  };
};

const parseWeekCommencing = (str: string): { date: number; month: string } | null => {
  const result = /^Monday\s*(?<date>\d+)\s*(?<month>.+)$/.exec(str.trim());
  if (result === null || result.groups === undefined) return null;
  return {
    date: Number(result.groups.date),
    month: result.groups.month,
  };
};

export const academicCalendarService = (now = () => new Date()): AcademicCalendarService => {
  const fetchTeachingDates = async () => {
    const result = await fetch(TEACHING_WEEKS_URL);
    const html = await result.text();
    const $ = cheerio.load(html);
    const cells = $('table[border=1] td font')
      .toArray()
      .map((cell) => cell.firstChild.data?.trim());
    const calendar: AcademicCalendar = { weeks: {} };
    let lastDate = -1;
    let lastMonth = '';
    for (const cell of cells) {
      if (!cell) continue;
      const weekCommencing = parseWeekCommencing(cell);
      const semesterWeek = parseSemesterWeek(cell);
      if (weekCommencing) {
        lastDate = weekCommencing.date;
        lastMonth = weekCommencing.month;
      }
      if (!semesterWeek) continue;

      const date = new Date(`${now().getFullYear()}-${lastMonth}-${lastDate}`);
      switch (semesterWeek.type) {
        case 'teaching':
          calendar.weeks[date.toJSON()] = {
            type: 'teaching',
            week: semesterWeek.week,
            semester: semesterWeek.semester,
            date,
          };
          break;
        case 'study-break':
          calendar.weeks[date.toJSON()] = {
            type: 'study-break',
            date,
          };
          break;
      }
    }
    return calendar;
  };

  const season = async () => {
    const month = now().getMonth();
    return month >= 6 && month < 9 ? 'Winter' : 'Summer';
  };

  const semester = async () => {
    const calendar = await fetchTeachingDates();
    console.log(calendar);
    return 1;
  };

  return {
    season,
    semester,
    teachingWeek: async () => 0,
    weeksUntilNextSemester: async () => 0,
  };
};
