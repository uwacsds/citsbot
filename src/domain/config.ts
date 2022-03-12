import { fieldValidator } from '../utils/validation';

export type BotConfig = {
  prefix: string;
  guild: string;
  logChannel: string;
  units?: Record<string, UnitConfig>;
  modules: {
    cowsay?: Record<string, unknown>;
    welcomer?: Record<string, unknown>;
    announcer?: Record<string, unknown>;
    reactRoles?: Record<string, unknown>;
    animeDetector?: Record<string, unknown>;
  };
}

export type UnitConfig = {
  name: string;
  role: string;
  channels: {
    general: string;
    resources: string;
  };
}

export const validateBotConfig = (rawConfig: Record<string, unknown>): BotConfig => {
  const config = rawConfig as BotConfig;

  const { validateValue } = fieldValidator(`Config Validation`);
  validateValue(rawConfig, `prefix`, `string`);
  validateValue(rawConfig, `guild`, `string`);
  validateValue(rawConfig, `logChannel`, `string`);

  if (config.units !== undefined) {
    if (Object.keys(config.units).length <= 0) throw Error(`Config Validation: No units found`);
    Object.entries(config.units).forEach(validateUnitConfig);
  }

  return config;
};

const validateUnitConfig = ([unitCode, rawConfig]: [string, Record<string, unknown>]) => {
  const { validateValue } = fieldValidator(`Config Validation: units[${unitCode}]`);
  validateValue(rawConfig, `name`, `string`);
  validateValue(rawConfig, `role`, `string`);
  validateUnitChannelsConfig(unitCode, rawConfig.channels as Record<string, unknown>);
};

const validateUnitChannelsConfig = (unitCode: string, rawConfig: Record<string, unknown>) => {
  const { validateValue } = fieldValidator(`Config Validation: units[${unitCode}].channels`);
  validateValue(rawConfig, `general`, `string`);
  validateValue(rawConfig, `resources`, `string`);
};
