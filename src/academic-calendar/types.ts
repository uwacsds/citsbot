export interface TeachingAcademicWeek {
  type: 'teaching';
  date: Date;
  semester: number;
  week: number;
}

export interface StudyBreakAcademicWeek {
  type: 'study-break';
  date: Date;
}

export interface ExamAcademicWeek {
  type: 'exam';
  date: Date;
}

export interface UnknownAcademicWeek {
  type: 'unknown';
}

export type AcademicWeek = TeachingAcademicWeek | StudyBreakAcademicWeek | ExamAcademicWeek | UnknownAcademicWeek;

export interface AcademicCalendar {
  weeks: Record<string, AcademicWeek>;
}

export interface AcademicCalendarParser {
  parseCalendar: (html: string) => AcademicCalendar;
}

export interface AcademicCalendarService {
  fetchCalendar: () => Promise<AcademicCalendar>;
}
