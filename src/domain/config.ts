import { AnimeDetectorConfig } from './anime-detector/anime-detector';
import { AnnouncerConfig } from './announcer/announcer';
import { CowsayConfig } from './cowsay/cowsay';
import { ReactRolesConfig } from './react-roles/react-roles';
import { WelcomerConfig } from './welcomer/welcomer';

export interface UnitConfig {
  name: string;
  role: string;
  channels: {
    general: string;
    resources: string;
  }
}

export interface BotConfig {
  prefix: string;
  guild: string;
  logChannel: string;
  units: Record<string, UnitConfig>;
  modules: {
    cowsay: CowsayConfig;
    welcomer: WelcomerConfig;
    announcer: AnnouncerConfig;
    reactRoles: ReactRolesConfig;
    animeDetector: AnimeDetectorConfig;
  };
}

const fieldValidator = (prefix: string) => (parent: any, field: string, expectedType: 'array' | 'bigint' | 'boolean' | 'number' | 'object' | 'string') => {
  if (expectedType === 'array') {
    if (parent[field].push === undefined) throw Error(`${prefix}: Expected '${field}' to have type '${expectedType}', got '${typeof (parent[field])}'`);
  } else {
    if (typeof (parent[field]) !== expectedType) throw Error(`${prefix}: Expected '${field}' to have type '${expectedType}', got '${typeof (parent[field])}'`);
  }
}

export const validateConfig = (rawConfig: any): BotConfig => {
  const config = rawConfig as BotConfig;

  const validate = fieldValidator('Config Validation');
  validate(rawConfig, 'prefix', 'string');
  validate(rawConfig, 'guild', 'string');
  validate(rawConfig, 'logChannel', 'string');
  validate(rawConfig, 'units', 'object');
  validate(rawConfig, 'modules', 'object');

  if (Object.keys(config.units).length <= 0) throw Error('Config Validation: No units found');
  Object.entries(config.units).forEach(validateUnitConfig);

  if (Object.keys(config.modules).length <= 0) throw Error('Config Validation: No module configs found');
  if (config.modules.cowsay !== undefined) validateCowsayConfig(config.modules.cowsay);
  if (config.modules.welcomer !== undefined) validateWelcomerConfig(config.modules.welcomer);
  if (config.modules.announcer !== undefined) validateAnnouncerConfig(config.modules.announcer);
  if (config.modules.reactRoles !== undefined) validateReactRolesConfig(config.modules.reactRoles, config.units);
  if (config.modules.animeDetector !== undefined) validateAnimeDetectorConfig(config.modules.animeDetector);

  return config;
};

const validateUnitConfig = ([unitCode, rawConfig]: any) => {
  const validate = fieldValidator(`Config Validation: units.${unitCode}`);
  validate(rawConfig, 'name', 'string');
  validate(rawConfig, 'role', 'string');
  validate(rawConfig, 'channels', 'object');
  validate(rawConfig.channels, 'general', 'string');
  validate(rawConfig.channels, 'general', 'string');
};

const validateCowsayConfig = (rawConfig: any) => {
  const validate = fieldValidator(`Config Validation: modules.cowsay`);
  validate(rawConfig, 'lineMaxLen', 'number');
  validate(rawConfig, 'cowArt', 'string');
};

const validateWelcomerConfig = (rawConfig: any) => {
  const validate = fieldValidator(`Config Validation: modules.welcomer`);
  validate(rawConfig, 'channel', 'string');
  validate(rawConfig, 'newMemberDm', 'object');
  validate(rawConfig.newMemberDm, 'delay', 'number');
  validate(rawConfig.newMemberDm, 'roleThreshold', 'number');
  validate(rawConfig.newMemberDm, 'instantAccountAge', 'number');
  validate(rawConfig.newMemberDm, 'message', 'string');
};

const validateAnnouncerConfig = (rawConfig: any) => {
  const validate = fieldValidator(`Config Validation: modules.announcer`);
  validate(rawConfig, 'channel', 'string');
  validate(rawConfig, 'crontab', 'string');
  validate(rawConfig, 'disclaimer', 'string');
  validate(rawConfig, 'image', 'string');
  validate(rawConfig, 'colour', 'string');
};

const validateReactRolesConfig = (rawConfig: any, unitsConfig: Record<string, UnitConfig>) => {
  const validate = fieldValidator(`Config Validation: modules.reactRoles`);
  validate(rawConfig, 'messages', 'array');

  rawConfig.messages.forEach((messageConfig: any, messageIdx: number) => {
    const validateMessage = fieldValidator(`Config Validation: modules.reactRoles.messages[${messageIdx}]`);
    validateMessage(messageConfig, 'id', 'string');
    validateMessage(messageConfig, 'channel', 'string');
    validateMessage(messageConfig, 'reactions', 'array');

    messageConfig.reactions.forEach((reactConfig: any, reactIdx: number) => {
      const prefix = `Config Validation: modules.reactRoles.messages[${messageIdx}].reactions[${reactIdx}]`;
      const validateReact = fieldValidator(prefix);
      validateReact(reactConfig, 'emoji', 'string');

      const hasUnit = reactConfig.unit !== undefined;
      const hasRole = reactConfig.role !== undefined;
      if (hasUnit && hasRole) throw Error(`${prefix}: Reactions cannot have both 'role' and 'unit' fields`);
      if (!hasUnit && !hasRole) throw Error(`${prefix}: Reactions can only have one of either 'role' or 'unit'`);
      if (!hasUnit && hasRole) validateReact(reactConfig, 'role', 'string');
      if (hasUnit && !hasRole) {
        validateReact(reactConfig, 'unit', 'string');
        if (!Object.keys(unitsConfig).includes(reactConfig.unit)) throw Error(`${prefix}: Unit '${reactConfig.unit}' is not defined in config.units`);
      }
    });
  });
};

const validateAnimeDetectorConfig = (rawConfig: any) => {
  const validate = fieldValidator(`Config Validation: modules.animeDetector`);
  validate(rawConfig, 'keywordCountThreshold', 'number');
  validate(rawConfig, 'keywords', 'array');
  rawConfig.keywords.forEach((keyword: any, idx: number) => {
    if (typeof (keyword) !== 'string') {
      throw Error(`Config Validation: modules.animeDetector.keywords[${idx}]: Expected to have type string`);
    }
  })
};
