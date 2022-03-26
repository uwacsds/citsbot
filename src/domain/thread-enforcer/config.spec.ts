import { validateThreadEnforcerConfig, ThreadEnforcerConfig } from './config';

describe(`thread enforcer config`, () => {
  const validConfig: ThreadEnforcerConfig = {
    channels: [
      { channelId: `channel-123`, channelName: `foo`, topicPlural: `topics`, topicSingular: `topic` },
    ],
    ruleBreakDm: `hello, world`,
  };

  test(`given valid config > when validate > should return valid config`, () => {
    expect(validateThreadEnforcerConfig(validConfig)).toEqual(validConfig);
  });

  test(`given invalid ruleBreakDm > when validate > should throw`, () => {
    const rawConfig = { ...validConfig, ruleBreakDm: undefined };
    expect(() => validateThreadEnforcerConfig(rawConfig))
      .toThrowError(`Config Validation: modules.threadChannelEnforcer: Expected 'ruleBreakDm' to have type 'string', got 'undefined'`);
  });

  test(`given invalid channelId > when validate > should throw`, () => {
    const rawConfig = { ...validConfig, channels: [{ ...validConfig.channels[0], channelId: undefined }] };
    expect(() => validateThreadEnforcerConfig(rawConfig))
      .toThrowError(`Config Validation: modules.threadChannelEnforcer.channels[0]: Expected 'channelId' to have type 'string', got 'undefined'`);
  });

  test(`given invalid channelName > when validate > should throw`, () => {
    const rawConfig = { ...validConfig, channels: [{ ...validConfig.channels[0], channelName: undefined }] };
    expect(() => validateThreadEnforcerConfig(rawConfig))
      .toThrowError(`Config Validation: modules.threadChannelEnforcer.channels[0]: Expected 'channelName' to have type 'string', got 'undefined'`);
  });

  test(`given invalid topicPlural > when validate > should throw`, () => {
    const rawConfig = { ...validConfig, channels: [{ ...validConfig.channels[0], topicPlural: undefined }] };
    expect(() => validateThreadEnforcerConfig(rawConfig))
      .toThrowError(`Config Validation: modules.threadChannelEnforcer.channels[0]: Expected 'topicPlural' to have type 'string', got 'undefined'`);
  });

  test(`given invalid topicSingular > when validate > should throw`, () => {
    const rawConfig = { ...validConfig, channels: [{ ...validConfig.channels[0], topicSingular: undefined }] };
    expect(() => validateThreadEnforcerConfig(rawConfig))
      .toThrowError(`Config Validation: modules.threadChannelEnforcer.channels[0]: Expected 'topicSingular' to have type 'string', got 'undefined'`);
  });
});
