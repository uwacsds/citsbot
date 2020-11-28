import nock from 'nock';
import { mockLogger } from '../utils/logging';
import { academicCalendarService } from './academic-calendar-service';
import { academicDeadlinesParser } from './deadlines-parser';
import { TEST_HTML_CSMARKS, TEST_HTML_CSMARKS_CITS1001, TEST_HTML_CSMARKS_CITS3200, TEST_HTML_WEEKS } from './test-data';
import { academicWeeksParser } from './weeks-parser';

const TEACHING_WEEKS_BASE = 'https://ipoint.uwa.edu.au';
const TEACHING_WEEKS_PATH = '/app/answers/detail/a_id/1405/~/2016-dates-and-teaching-weeks';

const CS_MARKS_BASE = 'https://secure.csse.uwa.edu.au';
const CS_MARKS_PATH = '/run/cssubmit';
const CS_MARKS_UNIT_PATH = /\/run\/cssubmit\?p\=np\&open=.*/;

describe('academic-calendar-service', () => {
  const now = new Date('2020-01-01');
  nock(TEACHING_WEEKS_BASE)
    .get(TEACHING_WEEKS_PATH)
    .reply(200, TEST_HTML_WEEKS);
  nock(CS_MARKS_BASE)
    .get(CS_MARKS_PATH)
    .reply(200, TEST_HTML_CSMARKS)
  nock(CS_MARKS_BASE)
    .get(CS_MARKS_UNIT_PATH)
    .times(999)
    .reply(200, TEST_HTML_CSMARKS_CITS1001);

  it('should parse a calendar after fetching and parsing from url', async () => {
    const { fetchCalendar } = academicCalendarService(mockLogger(), academicWeeksParser(() => now), academicDeadlinesParser(() => now));
    const { weeks } = await fetchCalendar();
    expect(Object.keys(weeks).length).toBeGreaterThan(30);
  });
});
