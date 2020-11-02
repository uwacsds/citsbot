type Season = 'Winter' | 'Summer';

export interface AcademicCalendar {
    semester: () => Promise<number>;
    teachingWeek: () => Promise<number>;
    weeksUntilNextSemester: () => Promise<number>;
    season: () => Promise<Season>;
}
