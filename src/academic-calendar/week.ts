const previousMonday = (_date: Date): Date => {
  const date = new Date(_date);
  date.setUTCDate(date.getUTCDate() - date.getUTCDay() + 1);
  return date;
};

const padZeros = (value: Number) => value.toString().padStart(2, '0');

export const getWeekIndex = (date: Date) => {
  const monday = previousMonday(date);
  return `${monday.getUTCFullYear()}-${padZeros(monday.getUTCMonth() + 1)}-${padZeros(monday.getUTCDate())}`;
};
