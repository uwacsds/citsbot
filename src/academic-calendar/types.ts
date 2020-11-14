export interface Deadline {
  unit: string;
  title: string;
  date: Date;
}

export interface TeachingAcademicWeek {
  type: 'teaching';
  date: Date;
  semester: number;
  week: number;
  deadlines: Deadline[];
}

export interface StudyBreakAcademicWeek {
  type: 'study-break';
  date: Date;
  deadlines: Deadline[];
}

export interface ExamAcademicWeek {
  type: 'exam';
  date: Date;
  deadlines: Deadline[];
}

export interface UnknownAcademicWeek {
  type: 'unknown';
  deadlines: Deadline[];
}

export type AcademicWeek = TeachingAcademicWeek | StudyBreakAcademicWeek | ExamAcademicWeek | UnknownAcademicWeek;

export interface AcademicCalendar {
  weeks: Record<string, AcademicWeek>;
}

export interface AcademicDeadlinesParser {
  parseUnitLinks: (html: string) => Array<{ code: string, link: string }>;
  parseUnitDeadlines: (unitCode: string, html: string) => Deadline[];
}

export interface AcademicWeeksParser {
  parseWeeks: (html: string) => Record<string, AcademicWeek>;
}

export interface AcademicCalendarService {
  fetchCalendar: () => Promise<AcademicCalendar>;
}
