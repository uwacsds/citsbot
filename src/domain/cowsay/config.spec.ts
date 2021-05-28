import { CowsayConfig, validateCowsayConfig } from './config';

describe(`cowsay config`, () => {
  const validConfig: CowsayConfig = {
    cowArt: `art-123`,
    lineMaxLen: 123,
  };

  test(`given valid config > when validate > should return valid config`, () => {
    expect(validateCowsayConfig(validConfig)).toEqual(validConfig);
  });

  test(`given invalid lineMaxLen > when validate > should throw`, () => {
    const rawConfig = { ...validConfig, lineMaxLen: undefined };
    expect(() => validateCowsayConfig(rawConfig)).toThrowError(`Config Validation: modules.cowsay: Expected 'lineMaxLen' to have type 'number', got 'undefined'`);
  });

  test(`given invalid cowArt > when validate > should throw`, () => {
    const rawConfig = { ...validConfig, cowArt: undefined };
    expect(() => validateCowsayConfig(rawConfig)).toThrowError(`Config Validation: modules.cowsay: Expected 'cowArt' to have type 'string', got 'undefined'`);
  });
});
