import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { AcademicCalendar } from './types';

const TEACHING_WEEKS_URL = 'https://ipoint.uwa.edu.au/app/answers/detail/a_id/1405/~/2016-dates-and-teaching-weeks';

export const academicCalendarService = (now: () => Date = () => new Date()): AcademicCalendar => {
    const fetchTeachingDates = async () => {
        const result = await fetch(TEACHING_WEEKS_URL);
        const html = await result.text();
        const $ = cheerio.load(html);

        const extractCells = () => {
            const TABLE_WIDTH = 4;
            const rows = $('table[border=1]').find('tr');
            const cells = rows.find('font');

            const getWeekNumber = (idx: number) => cells[idx * TABLE_WIDTH]?.firstChild.data?.trim();
            const getWeekCommencing = (idx: number) => cells[idx * TABLE_WIDTH + 1]?.firstChild.data?.trim();

            const results: [any, any][] = [];
            rows.each((idx) => {
                results.push([
                    getWeekNumber(idx),
                    getWeekCommencing(idx),
                ]);
            });

            // rows.each((_, row) => {
            //     const [weekNumberCell, weekCommencingCell] = row.children;
            //     const weekNumber = weekNumberCell.data;
            //     // console.log('this is the week number!', weekNumber);
            //     // const weekCommencing = weekCommencingCell.firstChild.innerText?.trim();
            //     // console.log(weekNumberCell);
            //     // if (weekNumber && weekCommencing) {
            //     //     results.push([weekNumber, weekCommencing]);
            //     // }
            // });
            return results;
            // const data = [];
            // cells.each((_, cell) => {
            //     const text = cell.firstChild.data?.trim();
            //     if (text) {
            //         data.push(text);
            //     }
            // });
        };

        const data = extractCells();
        console.log(data);

    };

    const season = async () => {
        const month = now().getMonth();
        return month >= 6 && month < 9 ? 'Winter' : 'Summer';
    };

    const semester = async () => {
        await fetchTeachingDates();
        return 1;
    };

    return {
        season,
        semester,
        teachingWeek: async () => 0,
        weeksUntilNextSemester:  async () => 0,
    };
};
