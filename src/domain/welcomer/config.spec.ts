import { validateWelcomerConfig, WelcomerConfig } from './config';

describe(`welcomer config`, () => {
  const validConfig: WelcomerConfig = {
    channel: `channel-123`,
    newMemberDm: {
      delay: 123,
      instantAccountAge: 234,
      message: `message-123`,
      roleThreshold: 345,
    },
  };

  test(`given valid config > when validate > should return valid config`, () => {
    expect(validateWelcomerConfig(validConfig)).toEqual(validConfig);
  });

  test(`given invalid channel > when validate > should throw`, () => {
    const rawConfig = { ...validConfig, channel: undefined };
    expect(() => validateWelcomerConfig(rawConfig)).toThrowError(`Config Validation: modules.welcomer: Expected 'channel' to have type 'string', got 'undefined'`);
  });

  test(`given invalid newMemberDm delay > when validate > should throw`, () => {
    const rawConfig = { ...validConfig, newMemberDm: { ...validConfig.newMemberDm, delay: undefined } };
    expect(() => validateWelcomerConfig(rawConfig)).toThrowError(`Config Validation: modules.welcomer.newMemberDm: Expected 'delay' to have type 'number', got 'undefined'`);
  });

  test(`given invalid newMemberDm instantAccountAge > when validate > should throw`, () => {
    const rawConfig = { ...validConfig, newMemberDm: { ...validConfig.newMemberDm, instantAccountAge: undefined } };
    expect(() => validateWelcomerConfig(rawConfig)).toThrowError(`Config Validation: modules.welcomer.newMemberDm: Expected 'instantAccountAge' to have type 'number', got 'undefined'`);
  });

  test(`given invalid newMemberDm message > when validate > should throw`, () => {
    const rawConfig = { ...validConfig, newMemberDm: { ...validConfig.newMemberDm, message: undefined } };
    expect(() => validateWelcomerConfig(rawConfig)).toThrowError(`Config Validation: modules.welcomer.newMemberDm: Expected 'message' to have type 'string', got 'undefined'`);
  });

  test(`given invalid newMemberDm roleThreshold > when validate > should throw`, () => {
    const rawConfig = { ...validConfig, newMemberDm: { ...validConfig.newMemberDm, roleThreshold: undefined } };
    expect(() => validateWelcomerConfig(rawConfig)).toThrowError(`Config Validation: modules.welcomer.newMemberDm: Expected 'roleThreshold' to have type 'number', got 'undefined'`);
  });
});
