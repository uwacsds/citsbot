type Season = 'Winter' | 'Summer';

export interface AcademicCalendarService {
  semester: () => Promise<number>;
  teachingWeek: () => Promise<number>;
  weeksUntilNextSemester: () => Promise<number>;
  season: () => Promise<Season>;
}
