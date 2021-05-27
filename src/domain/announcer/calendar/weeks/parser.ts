import * as cheerio from 'cheerio';
import { AcademicWeeksParser, AcademicWeek } from '../types';

interface ExamSemesterWeek {
  type: `exam`;
}

interface StudyBreakSemesterWeek {
  type: `study-break`;
}

interface TeachingSemesterWeek {
  type: `teaching`;
  semester: number;
  week: number;
}

const previousMonday = (_date: Date): Date => {
  const date = new Date(_date);
  date.setUTCDate(date.getUTCDate() - date.getUTCDay() + 1);
  return date;
};

const padZeros = (value: number) => value.toString().padStart(2, `0`);

export const getWeekIndex = (date: Date): string => {
  const monday = previousMonday(date);
  return `${monday.getUTCFullYear()}-${padZeros(monday.getUTCMonth() + 1)}-${padZeros(monday.getUTCDate())}`;
};

export const academicWeeksParser = (now = () => new Date()): AcademicWeeksParser => {
  const parseExamWeek = (str: string): ExamSemesterWeek | undefined => {
    const result = /^exams?\*?$/i.exec(str.trim());
    if (result === undefined) return undefined;
    return { type: `exam` };
  };

  const parseStudyBreakWeek = (str: string): StudyBreakSemesterWeek | undefined => {
    if (str.trim().toLowerCase() !== `study break`) return undefined;
    return { type: `study-break` };
  };

  const parseSemesterWeek = (str: string): TeachingSemesterWeek | undefined => {
    const result = /^Sem\s*(?<semester>\d+)\s*\/\s*Wk\s*(?<week>\d+)$/.exec(str.trim());
    if (result == undefined || result.groups == undefined) return undefined;
    return {
      type: `teaching`,
      semester: Number(result.groups.semester),
      week: Number(result.groups.week),
    };
  };

  const parseWeekCommencing = (str: string): { date: number; month: string } | undefined => {
    const result = /^Monday\s*(?<date>\d+)\s*(?<month>.+)$/.exec(str.trim());
    if (result == undefined || result.groups == undefined) return undefined;
    return {
      date: Number(result.groups.date),
      month: result.groups.month,
    };
  };

  return {
    parseWeeks: (html: string) => {
      const $ = cheerio.load(html);
      const cells = $(`table[border=1] td font`)
        .toArray()
        .map(cell => {
          if (cell.firstChild?.firstChild?.data) return cell.firstChild.firstChild.data.trim();
          return cell.firstChild.data?.trim();
        });
      const weeks: Record<string, AcademicWeek> = {};
      let lastDate = -1;
      let lastMonth = ``;
      for (const cell of cells) {
        if (!cell) continue;

        const weekCommencing = parseWeekCommencing(cell);
        if (weekCommencing) {
          lastDate = weekCommencing.date;
          lastMonth = weekCommencing.month;
          continue;
        }

        const semesterWeek = parseSemesterWeek(cell) ?? parseExamWeek(cell) ?? parseStudyBreakWeek(cell);
        if (!semesterWeek) continue;

        const date = new Date(`${now().getFullYear()}-${lastMonth}-${lastDate}Z00:00+00:00`);
        switch (semesterWeek.type) {
          case `teaching`:
            weeks[getWeekIndex(date)] = {
              type: `teaching`,
              deadlines: [],
              week: semesterWeek.week,
              semester: semesterWeek.semester,
              date,
            };
            break;
          case `study-break`:
            weeks[getWeekIndex(date)] = {
              type: `study-break`,
              deadlines: [],
              date,
            };
            break;
          case `exam`:
            weeks[getWeekIndex(date)] = {
              type: `exam`,
              deadlines: [],
              date,
            };
            break;
        }
      }
      return weeks;
    },
  };
};
