import * as cheerio from 'cheerio';
import { AcademicCalendar, AcademicCalendarParser } from './types';

interface StudyBreakSemesterWeek {
  type: 'study-break';
}

interface TeachingSemesterWeek {
  type: 'teaching';
  semester: number;
  week: number;
}

export const academicCalendarParser = (now = () => new Date()): AcademicCalendarParser => {
  const parseSemesterWeek = (str: string): StudyBreakSemesterWeek | TeachingSemesterWeek | null => {
    const result = /^Sem\s*(?<semester>\d+)\s*\/\s*Wk\s*(?<week>\d+)$|^Study\s*Break$/.exec(str.trim());
    if (result === null) return null;
    if (result.groups == undefined) {
      // FIXME: add exam weeks here
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

  return {
    parseCalendar: (html: string) => {
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
  
        const date = new Date(`${now().getFullYear()}-${lastMonth}-${lastDate}Z00:00+00:00`);
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
    },
  };
};
