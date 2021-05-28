import { fieldValidator, validString } from './validation';

describe(`validation util`, () => {
  describe(`valid string`, () => {
    test(`given string > when validate > should return true`, () => {
      expect(validString(`asd123`)).toBe(true);
    });

    test.each([
      [`bigint`, 123n],
      [`boolean`, true],
      [`function`, () => undefined],
      [`number`, 123],
      [`object`, {}],
      [`symbol`, [Symbol.iterator]],
      [`undefined`, undefined],
      [`null`, null],
      [`array`, [`asd`, `123`]],
    ])(`given %p > when validate > should return true`, (_, value) => {
      expect(validString(value)).toBe(false);
    });
  });

  describe(`field validator`, () => {
    const { validateValue, validateArray } = fieldValidator(`prefix`);

    test.each([
      [`bigint`, 123n],
      [`boolean`, true],
      [`function`, () => undefined],
      [`number`, 123],
      [`object`, {}],
      [`string`, `asd123`],
      [`undefined`, undefined],
    ])(`given field of type %p > when validate as value against different type > should throw`, (valueType, value) => {
      const allTypes: (`bigint` | `boolean` | `number` | `string`)[] = [`bigint`, `boolean`, `number`, `string`];
      for (const expectedType of allTypes.filter(type => type !== valueType)) {
        const obj = { x: value };
        expect(() => validateValue(obj, `x`, expectedType)).toThrowError(`prefix: Expected 'x' to have type '${expectedType}', got '${valueType}'`);
      }
    });

    test.each([
      [`bigint`, 123n],
      [`boolean`, true],
      [`number`, 123],
      [`string`, `asd123`],
    ])(`given field of type %p > when validate as value against expected type > should not throw`, (valueType, value) => {
      const obj = { x: value };
      expect(() => validateValue(obj, `x`, valueType as `bigint` | `boolean` | `number` | `string`)).not.toThrow();
    });

    test(`given field is not an array > when validate as array > should throw`, () => {
      const mockElementValidator = jest.fn();
      expect(() => validateArray({ x: 123 }, `x`, mockElementValidator)).toThrowError(`prefix: Expected 'x' to have type 'array', got 'number'`);
      expect(mockElementValidator).not.toHaveBeenCalled();
    });

    test(`given field is an array but element validator throws > when validate as array > should throw`, () => {
      const mockElementValidator = jest.fn().mockImplementation((element, elementIdx) => { if (typeof element !== `number`) throw Error(`Bad element at ${elementIdx}`); });
      const array = [123, 234, 345, `456`, 567];
      expect(() => validateArray({ x: array }, `x`, mockElementValidator)).toThrowError(`Bad element at 3`);
      expect(mockElementValidator).toHaveBeenCalledTimes(4);
      expect(mockElementValidator).toHaveBeenCalledWith(123, 0, array);
      expect(mockElementValidator).toHaveBeenCalledWith(234, 1, array);
      expect(mockElementValidator).toHaveBeenCalledWith(345, 2, array);
      expect(mockElementValidator).toHaveBeenCalledWith(`456`, 3, array);
    });

    test(`given field is an array and element validator does not throw > when validate as array > should not throw`, () => {
      const mockElementValidator = jest.fn().mockImplementation((element, elementIdx) => { if (typeof element !== `number`) throw Error(`Bad element at ${elementIdx}`); });
      const array = [123, 234, 345, 456, 567];
      expect(() => validateArray({ x: array }, `x`, mockElementValidator)).not.toThrow();
      expect(mockElementValidator).toHaveBeenCalledTimes(5);
      expect(mockElementValidator).toHaveBeenCalledWith(123, 0, array);
      expect(mockElementValidator).toHaveBeenCalledWith(234, 1, array);
      expect(mockElementValidator).toHaveBeenCalledWith(345, 2, array);
      expect(mockElementValidator).toHaveBeenCalledWith(456, 3, array);
      expect(mockElementValidator).toHaveBeenCalledWith(567, 4, array);
    });
  });
});
