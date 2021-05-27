import { academicWeeksParser } from './parser';
import { AcademicWeek } from '../types';
import { TEST_HTML_WEEKS } from '../test-data';

describe(`weeks-parser`, () => {
  const now = new Date(`2021-01-01`);
  const parser = academicWeeksParser(() => now);

  it(`should parse the raw html into academic weeks`, () => {
    expect(parser.parseWeeks(TEST_HTML_WEEKS)).toEqual(parsedCalendar);
  });
});

const parsedCalendar: Record<string, AcademicWeek> = {
  [`2021-02-22`]: {
    type: `teaching`,
    week: 1,
    semester: 1,
    date: new Date(`2021-02-22T00:00:00.000Z`),
    deadlines: [],
  },
  [`2021-03-01`]: {
    type: `teaching`,
    week: 2,
    semester: 1,
    date: new Date(`2021-03-01T00:00:00.000Z`),
    deadlines: [],
  },
  [`2021-03-08`]: {
    type: `teaching`,
    week: 3,
    semester: 1,
    date: new Date(`2021-03-08T00:00:00.000Z`),
    deadlines: [],
  },
  [`2021-03-15`]: {
    type: `teaching`,
    week: 4,
    semester: 1,
    date: new Date(`2021-03-15T00:00:00.000Z`),
    deadlines: [],
  },
  [`2021-03-22`]: {
    type: `teaching`,
    week: 5,
    semester: 1,
    date: new Date(`2021-03-22T00:00:00.000Z`),
    deadlines: [],
  },
  [`2021-03-29`]: {
    type: `teaching`,
    week: 6,
    semester: 1,
    date: new Date(`2021-03-29T00:00:00.000Z`),
    deadlines: [],
  },
  [`2021-04-05`]: {
    date: new Date(`2021-04-05T00:00:00.000Z`),
    type: `study-break`,
    deadlines: [],
  },
  [`2021-04-12`]: {
    type: `teaching`,
    week: 7,
    semester: 1,
    date: new Date(`2021-04-12T00:00:00.000Z`),
    deadlines: [],
  },
  [`2021-04-19`]: {
    type: `teaching`,
    week: 8,
    semester: 1,
    date: new Date(`2021-04-19T00:00:00.000Z`),
    deadlines: [],
  },
  [`2021-04-26`]: {
    type: `teaching`,
    week: 9,
    semester: 1,
    date: new Date(`2021-04-26T00:00:00.000Z`),
    deadlines: [],
  },
  [`2021-05-03`]: {
    type: `teaching`,
    week: 10,
    semester: 1,
    date: new Date(`2021-05-03T00:00:00.000Z`),
    deadlines: [],
  },
  [`2021-05-10`]: {
    type: `teaching`,
    week: 11,
    semester: 1,
    date: new Date(`2021-05-10T00:00:00.000Z`),
    deadlines: [],
  },
  [`2021-05-17`]: {
    type: `teaching`,
    week: 12,
    semester: 1,
    date: new Date(`2021-05-17T00:00:00.000Z`),
    deadlines: [],
  },
  [`2021-05-24`]: {
    date: new Date(`2021-05-24T00:00:00.000Z`),
    type: `study-break`,
    deadlines: [],
  },
  [`2021-05-31`]: {
    date: new Date(`2021-05-31T00:00:00.000Z`),
    type: `exam`,
    deadlines: [],
  },
  [`2021-06-07`]: {
    date: new Date(`2021-06-07T00:00:00.000Z`),
    type: `exam`,
    deadlines: [],
  },
  [`2021-07-26`]: {
    type: `teaching`,
    week: 1,
    semester: 2,
    date: new Date(`2021-07-26T00:00:00.000Z`),
    deadlines: [],
  },
  [`2021-08-02`]: {
    type: `teaching`,
    week: 2,
    semester: 2,
    date: new Date(`2021-08-02T00:00:00.000Z`),
    deadlines: [],
  },
  [`2021-08-09`]: {
    type: `teaching`,
    week: 3,
    semester: 2,
    date: new Date(`2021-08-09T00:00:00.000Z`),
    deadlines: [],
  },
  [`2021-08-16`]: {
    type: `teaching`,
    week: 4,
    semester: 2,
    date: new Date(`2021-08-16T00:00:00.000Z`),
    deadlines: [],
  },
  [`2021-08-23`]: {
    type: `teaching`,
    week: 5,
    semester: 2,
    date: new Date(`2021-08-23T00:00:00.000Z`),
    deadlines: [],
  },
  [`2021-08-30`]: {
    type: `teaching`,
    week: 6,
    semester: 2,
    date: new Date(`2021-08-30T00:00:00.000Z`),
    deadlines: [],
  },
  [`2021-09-06`]: {
    date: new Date(`2021-09-06T00:00:00.000Z`),
    type: `study-break`,
    deadlines: [],
  },
  [`2021-09-13`]: {
    type: `teaching`,
    week: 7,
    semester: 2,
    date: new Date(`2021-09-13T00:00:00.000Z`),
    deadlines: [],
  },
  [`2021-09-20`]: {
    type: `teaching`,
    week: 8,
    semester: 2,
    date: new Date(`2021-09-20T00:00:00.000Z`),
    deadlines: [],
  },
  [`2021-09-27`]: {
    type: `teaching`,
    week: 9,
    semester: 2,
    date: new Date(`2021-09-27T00:00:00.000Z`),
    deadlines: [],
  },
  [`2021-10-04`]: {
    type: `teaching`,
    week: 10,
    semester: 2,
    date: new Date(`2021-10-04T00:00:00.000Z`),
    deadlines: [],
  },
  [`2021-10-11`]: {
    type: `teaching`,
    week: 11,
    semester: 2,
    date: new Date(`2021-10-11T00:00:00.000Z`),
    deadlines: [],
  },
  [`2021-10-18`]: {
    type: `teaching`,
    week: 12,
    semester: 2,
    date: new Date(`2021-10-18T00:00:00.000Z`),
    deadlines: [],
  },
  [`2021-10-25`]: {
    date: new Date(`2021-10-25T00:00:00.000Z`),
    type: `study-break`,
    deadlines: [],
  },
  [`2021-11-01`]: {
    date: new Date(`2021-11-01T00:00:00.000Z`),
    type: `exam`,
    deadlines: [],
  },
  [`2021-11-08`]: {
    date: new Date(`2021-11-08T00:00:00.000Z`),
    type: `exam`,
    deadlines: [],
  },
};
