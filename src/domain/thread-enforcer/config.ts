import { fieldValidator } from '../../utils/validation';

export type ThreadEnforcerConfig = {
  channels: ThreadEnforcerChannelConfig[];
  ruleBreakDm: string
}

type ThreadEnforcerChannelConfig = {
  channelId: string
  channelName: string
  topicSingular: string
  topicPlural: string
}

export const validateThreadEnforcerConfig = (rawConfig: Record<string, unknown>): ThreadEnforcerConfig => {
  const { validateValue, validateArray } = fieldValidator(`Config Validation: modules.threadChannelEnforcer`);
  validateValue(rawConfig, `ruleBreakDm`, `string`);
  validateArray(rawConfig, `channels`, validateChannelsElement);
  return rawConfig as ThreadEnforcerConfig;
};

const validateChannelsElement = (rawConfig: Record<string, unknown>, elementIdx: number): rawConfig is ThreadEnforcerChannelConfig => {
  const { validateValue } = fieldValidator(`Config Validation: modules.threadChannelEnforcer.channels[${elementIdx}]`);
  validateValue(rawConfig, `channelId`, `string`);
  validateValue(rawConfig, `channelName`, `string`);
  validateValue(rawConfig, `topicSingular`, `string`);
  validateValue(rawConfig, `topicPlural`, `string`);
  return true;
};
