export interface Deadline {
  unit: string;
  assignment: string;
  due: Date;
}

export interface UnitDeadlineService {
  upcomingDeadlines: (date: Date) => Deadline[];
}
