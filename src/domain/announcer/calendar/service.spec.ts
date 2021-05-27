import nock from 'nock';
import { mockLogger } from '../../../utils/logging';
import { academicCalendarService } from './service';
import { TEST_HTML_CSMARKS, TEST_HTML_CSMARKS_CITS1001, TEST_HTML_WEEKS } from './test-data';

describe(`academic-calendar-service`, () => {
  nock(`https://teaching-weeks.local`).get(`/data`).reply(200, TEST_HTML_WEEKS);
  nock(`https://secure.csse.uwa.edu.au`).get(`/run/cssubmit`).reply(200, TEST_HTML_CSMARKS);
  nock(`https://secure.csse.uwa.edu.au`)
    .get(/\/run\/cssubmit\?p=np&open=.*/)
    .times(999)
    .reply(200, TEST_HTML_CSMARKS_CITS1001);

  it(`should parse a calendar after fetching and parsing from url`, async () => {
    const fetchCalendar = academicCalendarService(mockLogger(), `https://teaching-weeks.local/data`, `https://secure.csse.uwa.edu.au/run/cssubmit`);
    const { weeks } = await fetchCalendar();
    expect(Object.keys(weeks).length).toBeGreaterThan(30);
  });
});
