import { academicDeadlinesParser } from './deadlines-parser';
import { TEST_HTML_CSMARKS_CITS1001, TEST_HTML_CSMARKS_CITS3200, TEST_HTML_CSMARKS } from './test-data';

describe('deadlines-parser', () => {
  const parser = academicDeadlinesParser();

  it('should parse unit links from cssubmit main page', () => {
    expect(parser.parseUnitLinks(TEST_HTML_CSMARKS)).toEqual([
      { code: 'CITS1001', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS1001-2' },
      { code: 'CITS1402', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS1402-2' },
      { code: 'CITS2002', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS2002-2' },
      { code: 'CITS2402', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS2402-2' },
      { code: 'CITS3001', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS3001-2' },
      { code: 'CITS3200', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS3200-2' },
      { code: 'CITS4001', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS4001-2' },
      { code: 'CITS4002', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS4002-2' },
      { code: 'CITS4009', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS4009-2' },
      { code: 'CITS4419', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS4419-2' },
      { code: 'CITS5013', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS5013-2' },
      { code: 'CITS5014', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS5014-2' },
      { code: 'CITS5015', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS5015-2' },
      { code: 'CITS5206', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS5206-2' },
      { code: 'CITS5507', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS5507-2' },
      { code: 'CITS1001', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS1001-1' },
      { code: 'CITS2200', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS2200-1' },
      { code: 'CITS3002', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS3002-1' },
      { code: 'CITS3003', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS3003-1' },
      { code: 'CITS3401', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS3401-1' },
      { code: 'CITS3403', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS3403-1' },
      { code: 'CITS4001', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS4001-1' },
      { code: 'CITS4401', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS4401-1' },
      { code: 'CITS4407', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS4407-1' },
      { code: 'CITS5013', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS5013-1' },
      { code: 'CITS5014', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS5014-1' },
      { code: 'CITS5501', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS5501-1' },
      { code: 'CITS5504', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS5504-1' },
      { code: 'CITS5505', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS5505-1' },
      { code: 'CITS5508', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS5508-1' },
    ]);
  });

  it('should parse deadlines from cssubmit unit page', () => {
    expect(parser.parseUnitDeadlines('CITS1001', TEST_HTML_CSMARKS_CITS1001)).toEqual([
      { unit: 'CITS1001', date: new Date('2020-09-25T17:00:00.000+08:00'), title: 'Project 1, contributing 15%' },
      { unit: 'CITS1001', date: new Date('2020-11-13T17:00:00.000+08:00'), title: 'Project 2, contributing 25%' },
    ]);
    expect(parser.parseUnitDeadlines('CITS3200', TEST_HTML_CSMARKS_CITS3200)).toEqual([
      {
        unit: 'CITS3200',
        date: new Date('2020-08-19T23:59:00.000+08:00'),
        title: 'Sprint 1 team deliverables, contributing 5%',
      },
      {
        unit: 'CITS3200',
        date: new Date('2020-08-21T23:59:00.000+08:00'),
        title: 'Sprint 1 Personal Reflection, contributing 5%',
      },
      { unit: 'CITS3200', date: new Date('2020-09-11T23:59:00.000+08:00'), title: 'PDP' },
      {
        unit: 'CITS3200',
        date: new Date('2020-09-16T23:59:00.000+08:00'),
        title: 'Sprint 2 team deliverables, contributing 10%',
      },
      {
        unit: 'CITS3200',
        date: new Date('2020-09-18T23:59:00.000+08:00'),
        title: 'Sprint 2 Personal Reflection, contributing 5%',
      },
      {
        unit: 'CITS3200',
        date: new Date('2020-10-21T23:59:00.000+08:00'),
        title: 'Sprint 3 team deliverables, contributing 15%',
      },
      {
        unit: 'CITS3200',
        date: new Date('2020-10-23T23:59:00.000+08:00'),
        title: 'Sprint 3 Personal Reflection, contributing 5%',
      },
    ]);
  });
});
