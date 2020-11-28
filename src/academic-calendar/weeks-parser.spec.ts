import { academicWeeksParser } from './weeks-parser';
import { AcademicWeek } from './types';
import { TEST_HTML_WEEKS } from './test-data';

describe('weeks-parser', () => {
  const now = new Date('2020-01-01');
  const parser = academicWeeksParser(() => now);

  it('should parse the raw html into academic weeks', () => {
    expect(parser.parseWeeks(TEST_HTML_WEEKS)).toEqual(parsedCalendar);
  });
});

const parsedCalendar: Record<string, AcademicWeek> = {
  ['2020-02-24']: {
    type: 'teaching',
    week: 1,
    semester: 1,
    date: new Date('2020-02-24T00:00:00.000Z'),
    deadlines: [],
  },
  ['2020-03-02']: {
    type: 'teaching',
    week: 2,
    semester: 1,
    date: new Date('2020-03-02T00:00:00.000Z'),
    deadlines: [],
  },
  ['2020-03-09']: {
    type: 'teaching',
    week: 3,
    semester: 1,
    date: new Date('2020-03-09T00:00:00.000Z'),
    deadlines: [],
  },
  ['2020-03-16']: {
    type: 'teaching',
    week: 4,
    semester: 1,
    date: new Date('2020-03-16T00:00:00.000Z'),
    deadlines: [],
  },
  ['2020-03-23']: {
    type: 'teaching',
    week: 5,
    semester: 1,
    date: new Date('2020-03-23T00:00:00.000Z'),
    deadlines: [],
  },
  ['2020-03-30']: {
    type: 'teaching',
    week: 6,
    semester: 1,
    date: new Date('2020-03-30T00:00:00.000Z'),
    deadlines: [],
  },
  ['2020-04-06']: {
    date: new Date('2020-04-06T00:00:00.000Z'),
    type: 'study-break',
    deadlines: [],
  },
  ['2020-04-13']: {
    date: new Date('2020-04-13T00:00:00.000Z'),
    type: 'study-break',
    deadlines: [],
  },
  ['2020-04-20']: {
    type: 'teaching',
    week: 7,
    semester: 1,
    date: new Date('2020-04-20T00:00:00.000Z'),
    deadlines: [],
  },
  ['2020-04-27']: {
    type: 'teaching',
    week: 8,
    semester: 1,
    date: new Date('2020-04-27T00:00:00.000Z'),
    deadlines: [],
  },
  ['2020-05-04']: {
    type: 'teaching',
    week: 9,
    semester: 1,
    date: new Date('2020-05-04T00:00:00.000Z'),
    deadlines: [],
  },
  ['2020-05-11']: {
    type: 'teaching',
    week: 10,
    semester: 1,
    date: new Date('2020-05-11T00:00:00.000Z'),
    deadlines: [],
  },
  ['2020-05-18']: {
    type: 'teaching',
    week: 11,
    semester: 1,
    date: new Date('2020-05-18T00:00:00.000Z'),
    deadlines: [],
  },
  ['2020-05-25']: {
    type: 'teaching',
    week: 12,
    semester: 1,
    date: new Date('2020-05-25T00:00:00.000Z'),
    deadlines: [],
  },
  ['2020-06-01']: {
    date: new Date('2020-06-01T00:00:00.000Z'),
    type: 'study-break',
    deadlines: [],
  },
  ['2020-06-08']: {
    date: new Date('2020-06-08T00:00:00.000Z'),
    type: 'exam',
    deadlines: [],
  },
  ['2020-06-15']: {
    date: new Date('2020-06-15T00:00:00.000Z'),
    type: 'exam',
    deadlines: [],
  },
  ['2020-07-27']: {
    type: 'teaching',
    week: 1,
    semester: 2,
    date: new Date('2020-07-27T00:00:00.000Z'),
    deadlines: [],
  },
  ['2020-08-03']: {
    type: 'teaching',
    week: 2,
    semester: 2,
    date: new Date('2020-08-03T00:00:00.000Z'),
    deadlines: [],
  },
  ['2020-08-10']: {
    type: 'teaching',
    week: 3,
    semester: 2,
    date: new Date('2020-08-10T00:00:00.000Z'),
    deadlines: [],
  },
  ['2020-08-17']: {
    type: 'teaching',
    week: 4,
    semester: 2,
    date: new Date('2020-08-17T00:00:00.000Z'),
    deadlines: [],
  },
  ['2020-08-24']: {
    type: 'teaching',
    week: 5,
    semester: 2,
    date: new Date('2020-08-24T00:00:00.000Z'),
    deadlines: [],
  },
  ['2020-08-31']: {
    type: 'teaching',
    week: 6,
    semester: 2,
    date: new Date('2020-08-31T00:00:00.000Z'),
    deadlines: [],
  },
  ['2020-09-07']: {
    type: 'teaching',
    week: 7,
    semester: 2,
    date: new Date('2020-09-07T00:00:00.000Z'),
    deadlines: [],
  },
  ['2020-09-14']: {
    type: 'teaching',
    week: 8,
    semester: 2,
    date: new Date('2020-09-14T00:00:00.000Z'),
    deadlines: [],
  },
  ['2020-09-21']: {
    type: 'teaching',
    week: 9,
    semester: 2,
    date: new Date('2020-09-21T00:00:00.000Z'),
    deadlines: [],
  },
  ['2020-09-28']: {
    date: new Date('2020-09-28T00:00:00.000Z'),
    type: 'study-break',
    deadlines: [],
  },
  ['2020-10-05']: {
    type: 'teaching',
    week: 10,
    semester: 2,
    date: new Date('2020-10-05T00:00:00.000Z'),
    deadlines: [],
  },
  ['2020-10-12']: {
    type: 'teaching',
    week: 11,
    semester: 2,
    date: new Date('2020-10-12T00:00:00.000Z'),
    deadlines: [],
  },
  ['2020-10-19']: {
    type: 'teaching',
    week: 12,
    semester: 2,
    date: new Date('2020-10-19T00:00:00.000Z'),
    deadlines: [],
  },
  ['2020-10-26']: {
    date: new Date('2020-10-26T00:00:00.000Z'),
    type: 'study-break',
    deadlines: [],
  },
  ['2020-11-02']: {
    date: new Date('2020-11-02T00:00:00.000Z'),
    type: 'exam',
    deadlines: [],
  },
  ['2020-11-09']: {
    date: new Date('2020-11-09T00:00:00.000Z'),
    type: 'exam',
    deadlines: [],
  },
};
