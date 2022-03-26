import { unwrap } from './unwrap';

describe(`unwrap`, () => {
  test(`given value is null > when unwrap > should throw`, () => {
    const value = null;
    expect(() => unwrap(value)).toThrowError(new Error(`Failed to unwrap value`));
  });

  test(`given value is undefined > when unwrap > should throw`, () => {
    const value = undefined;
    expect(() => unwrap(value)).toThrowError(new Error(`Failed to unwrap value`));
  });

  test.each([
    [`object`, { foo: 123 }],
    [`empty object`, {}],
    [`array`, [1, 2, 3]],
    [`empty array`, []],
    [`number`, 123],
    [`string`, `foo`],
  ])(`given value is %p > when unwrap > should throw`, (_, value) => {
    expect(unwrap(value)).toEqual(value);
  });
});
