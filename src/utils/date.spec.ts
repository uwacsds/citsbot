import { daysBetween } from './date';

describe(`date util`, () => {
  describe(`days between`, () => {
    test(`given two dates in ascending order > when get days between > should return expected value`, () => {
      const day0 = new Date(`2020-02-02`);
      const day1 = new Date(`2020-02-05`);
      expect(daysBetween(day0, day1)).toBe(3);
    });

    test(`given two dates in descending order > when get days between > should return expected value`, () => {
      const day0 = new Date(`2020-02-05`);
      const day1 = new Date(`2020-02-02`);
      expect(daysBetween(day0, day1)).toBe(3);
    });
  });
});
