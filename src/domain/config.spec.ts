import { BotConfig, UnitConfig, validateBotConfig } from './config';

describe(`bot config`, () => {
  const validUnitConfig: UnitConfig = { name: `Test Unit 1001`, role: `role-1001`, channels: { general: `general-channel-1001`, resources: `resources-channel-1001` } };
  const validConfig: BotConfig = {
    prefix: `prefix-123`,
    guild: `guild-123`,
    logChannel: `channel-123`,
    units: {
      [`TEST1001`]: { name: `Test Unit 1001`, role: `role-1001`, channels: { general: `general-channel-1001`, resources: `resources-channel-1001` } },
      [`TEST2002`]: { name: `Test Unit 2002`, role: `role-2002`, channels: { general: `general-channel-2002`, resources: `resources-channel-2002` } },
      [`TEST3003`]: { name: `Test Unit 3003`, role: `role-3003`, channels: { general: `general-channel-3003`, resources: `resources-channel-3003` } },
    },
    modules: {} as never,
  };

  test(`given valid config > when validate > should return valid config`, () => {
    expect(validateBotConfig(validConfig)).toEqual(validConfig);
  });

  test(`given invalid prefix > when validate > should throw`, () => {
    const rawConfig = { ...validConfig, prefix: undefined };
    expect(() => validateBotConfig(rawConfig)).toThrowError(`Config Validation: Expected 'prefix' to have type 'string', got 'undefined'`);
  });

  test(`given invalid guild > when validate > should throw`, () => {
    const rawConfig = { ...validConfig, guild: undefined };
    expect(() => validateBotConfig(rawConfig)).toThrowError(`Config Validation: Expected 'guild' to have type 'string', got 'undefined'`);
  });

  test(`given invalid logChannel > when validate > should throw`, () => {
    const rawConfig = { ...validConfig, logChannel: undefined };
    expect(() => validateBotConfig(rawConfig)).toThrowError(`Config Validation: Expected 'logChannel' to have type 'string', got 'undefined'`);
  });

  test(`given invalid no units > when validate > should throw`, () => {
    const rawConfig = { ...validConfig, units: {} };
    expect(() => validateBotConfig(rawConfig)).toThrowError(`Config Validation: No units found`);
  });

  test(`given invalid unit name > when validate > should throw`, () => {
    const rawConfig = { ...validConfig, units: { [`TEST1001`]: { ...validUnitConfig, name: undefined } } };
    expect(() => validateBotConfig(rawConfig)).toThrowError(`Config Validation: units[TEST1001]: Expected 'name' to have type 'string', got 'undefined'`);
  });

  test(`given invalid unit role > when validate > should throw`, () => {
    const rawConfig = { ...validConfig, units: { [`TEST1001`]: { ...validUnitConfig, role: undefined } } };
    expect(() => validateBotConfig(rawConfig)).toThrowError(`Config Validation: units[TEST1001]: Expected 'role' to have type 'string', got 'undefined'`);
  });

  test(`given invalid unit channel general > when validate > should throw`, () => {
    const rawConfig = { ...validConfig, units: { [`TEST1001`]: { ...validUnitConfig, channels: { ...validUnitConfig.channels, general: undefined } } } };
    expect(() => validateBotConfig(rawConfig)).toThrowError(`Config Validation: units[TEST1001].channels: Expected 'general' to have type 'string', got 'undefined'`);
  });

  test(`given invalid unit channel resources > when validate > should throw`, () => {
    const rawConfig = { ...validConfig, units: { [`TEST1001`]: { ...validUnitConfig, channels: { ...validUnitConfig.channels, resources: undefined } } } };
    expect(() => validateBotConfig(rawConfig)).toThrowError(`Config Validation: units[TEST1001].channels: Expected 'resources' to have type 'string', got 'undefined'`);
  });

  test(`given config does not contain units > when validate > should not throw`, () => {
    const rawConfig = { ...validConfig, units: undefined };
    expect(() => validateBotConfig(rawConfig)).not.toThrow();
  });
});
