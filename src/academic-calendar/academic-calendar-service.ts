import fetch from 'node-fetch';
import { AcademicCalendarParser, AcademicCalendarService } from './types';

const TEACHING_WEEKS_URL = 'https://ipoint.uwa.edu.au/app/answers/detail/a_id/1405/~/2016-dates-and-teaching-weeks';

export const academicCalendarService = (parser: AcademicCalendarParser): AcademicCalendarService => ({
  fetchCalendar: async () => {
    const result = await fetch(TEACHING_WEEKS_URL);
    const html = await result.text();
    return parser.parseCalendar(html);
  },
});
