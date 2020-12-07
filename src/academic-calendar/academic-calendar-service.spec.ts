import nock from 'nock';
import { mockLogger } from '../utils/logging';
import { academicCalendarService } from './academic-calendar-service';
import { academicDeadlinesParser } from './deadlines-parser';
import { TEST_HTML_CSMARKS, TEST_HTML_CSMARKS_CITS1001, TEST_HTML_WEEKS } from './test-data';
import { academicWeeksParser } from './weeks-parser';

describe.skip('academic-calendar-service', () => {
  const now = new Date('2020-01-01');
  nock('https://ipoint.uwa.edu.au').get('/app/answers/detail/a_id/1405/~/2016-dates-and-teaching-weeks').reply(200, TEST_HTML_WEEKS);
  nock('https://secure.csse.uwa.edu.au').get('/run/cssubmit').reply(200, TEST_HTML_CSMARKS);
  nock('https://secure.csse.uwa.edu.au')
    .get(/\/run\/cssubmit\?p=np&open=.*/)
    .times(999)
    .reply(200, TEST_HTML_CSMARKS_CITS1001);

  it('should parse a calendar after fetching and parsing from url', async () => {
    const { fetchCalendar } = academicCalendarService(
      mockLogger(),
      academicWeeksParser(() => now),
      academicDeadlinesParser()
    );
    const { weeks } = await fetchCalendar();
    expect(Object.keys(weeks).length).toBeGreaterThan(30);
  });
});
