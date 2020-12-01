export const daysBetween = (startDate: Date, endDate: Date): number => {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.abs((endDate.getTime() - startDate.getTime()) / millisecondsPerDay);
};
