import * as cheerio from 'cheerio';
import { AcademicDeadlinesParser, Deadline } from './types';

const zip = <T1, T2>(arr1: T1[], arr2: T2[]): [T1, T2][] => arr1.map((_, idx) => [arr1[idx], arr2[idx]]);

const parseDate = (str: string): Date | null => {
  const result = /(?<hours12>\d\d?):(?<mins>\d\d)(?<meridiem>am|pm) (?<day>[^ ]+) (?<date>\d\d?)(st|nd|rd|th) (?<month>[^ ,]+), (?<year>\d{4})/i.exec(str);
  if (!result || !result.groups) return null;
  const { hours12, mins, meridiem, date, month, year } = result.groups;
  const hours24 = meridiem === 'pm' ? Number(hours12) + 12 : Number(hours12);
  const x = `${year} ${month} ${date} ${hours24}:${mins}`;
  return new Date(`${year}-${month}-${date} ${hours24}:${mins}+08:00`);
};

const parseDeadlineRow = (unit: string) => (row: cheerio.Element): Deadline | null => {
  const cells = cheerio.load(row)('td').toArray();
  if (cells.length !== 3) return null;

  const [_, titleCell, dateCell] = cells;
  const title = titleCell.lastChild.data?.trim();
  if (!title) return null;

  const date = parseDate(dateCell.firstChild.firstChild.data?.trim() ?? '');
  if (!date) return null;

  return {
    date,
    title,
    unit,
  };
};

export const academicDeadlinesParser = (): AcademicDeadlinesParser => ({
  parseUnitLinks: (html: string) => {
    const $ = cheerio.load(html);
    const unitCodes = $('td.thin')
      .toArray()
      .map((element) => element.firstChild.data)
      .filter((code): code is string => code !== undefined && code !== '\n\n')
      .map((code) => code.slice(0, code.length - 3));
    const unitLinks = $('td.thing > a')
      .toArray()
      .map((element) => element.attribs.href);
    return zip(unitCodes, unitLinks).map(([code, link]) => ({ code, link }));
  },
  parseUnitDeadlines: (unitCode: string, html: string) => {
    const $ = cheerio.load(html);
    return $('table.thin > tbody > tr')
      .toArray()
      .map(parseDeadlineRow(unitCode))
      .filter((deadline): deadline is Deadline => deadline !== null);
  },
});
