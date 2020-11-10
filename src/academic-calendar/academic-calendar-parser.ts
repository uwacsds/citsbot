import * as cheerio from 'cheerio';
import { AcademicCalendar, AcademicCalendarParser } from './types';

interface ExamSemesterWeek {
  type: 'exam';
}

interface StudyBreakSemesterWeek {
  type: 'study-break';
}

interface TeachingSemesterWeek {
  type: 'teaching';
  semester: number;
  week: number;
}

export const academicCalendarParser = (now = () => new Date()): AcademicCalendarParser => {
  const parseExamWeek = (str: string): ExamSemesterWeek | null => {
    const result = /^exams?\*?$/i.exec(str.trim());
    if (result === null) return null;
    return { type: 'exam' };
  };

  const parseStudyBreakWeek = (str: string): StudyBreakSemesterWeek | null => {
    if (str.trim().toLowerCase() !== 'study break') return null;
    return { type: 'study-break' };
  };

  const parseSemesterWeek = (str: string): TeachingSemesterWeek | null => {
    const result = /^Sem\s*(?<semester>\d+)\s*\/\s*Wk\s*(?<week>\d+)$|^Study\s*Break$/.exec(str.trim());
    if (result === null || result.groups == null) return null;
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
        .map((cell) => {
          if (cell.firstChild?.firstChild?.data) return cell.firstChild.firstChild.data.trim();
          return cell.firstChild.data?.trim();
        });
      const calendar: AcademicCalendar = { weeks: {} };
      let lastDate = -1;
      let lastMonth = '';
      for (const cell of cells) {
        if (!cell) continue;

        const weekCommencing = parseWeekCommencing(cell);
        if (weekCommencing) {
          lastDate = weekCommencing.date;
          lastMonth = weekCommencing.month;
          continue;
        }

        const semesterWeek = parseExamWeek(cell) ?? parseStudyBreakWeek(cell) ?? parseSemesterWeek(cell);
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
          case 'exam':
            calendar.weeks[date.toJSON()] = {
              type: 'exam',
              date,
            };
            break;
        }
      }
      return calendar;
    },
  };
};
