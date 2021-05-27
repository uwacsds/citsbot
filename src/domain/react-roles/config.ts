import { fieldValidator } from '../../utils/validator';
import { UnitConfig } from '../config';

export type ReactRolesConfig = {
  messages: ReactRolesMessageConfig[];
}

type ReactRolesMessageConfig = {
  id: string;
  channel: string;
  reactions: ReactRolesMessageReactionConfig[];
}

type ReactRolesMessageReactionConfig = {
  role?: string;
  unit?: string;
  emoji: string;
}

export const validateReactRolesConfig = (rawConfig: Record<string, unknown>, unitsConfig: Record<string, UnitConfig>): rawConfig is ReactRolesConfig => {
  const { validateArray } = fieldValidator('Config Validation: modules.reactRoles');
  validateArray(rawConfig, 'messages', validateMessagesConfig(unitsConfig));
  return true;
};

const validateMessagesConfig = (unitsConfig: Record<string, UnitConfig>) => (rawConfig: Record<string, unknown>, messageIdx: number): rawConfig is ReactRolesMessageConfig => {
  const { validateValue, validateArray } = fieldValidator(`Config Validation: modules.reactRoles.messages[${messageIdx}]`);
  validateValue(rawConfig, 'id', 'string');
  validateValue(rawConfig, 'channel', 'string');
  validateArray(rawConfig, 'reactions', validateReactionConfig(unitsConfig, messageIdx));
  return true;
};

const validateReactionConfig = (unitsConfig: Record<string, UnitConfig>, messageIdx: number) => (rawConfig: Record<string, unknown>, reactIdx: number): rawConfig is ReactRolesMessageReactionConfig => {
  const prefix = `Config Validation: modules.reactRoles.messages[${messageIdx}].reactions[${reactIdx}]`;
  const { validateValue } = fieldValidator(prefix);
  validateValue(rawConfig, 'emoji', 'string');

  const hasUnit = rawConfig.unit !== undefined;
  const hasRole = rawConfig.role !== undefined;
  if (hasUnit && hasRole) throw Error(`${prefix}: Reactions cannot have both 'role' and 'unit' fields`);
  if (!hasUnit && !hasRole) throw Error(`${prefix}: Reactions can only have one of either 'role' or 'unit'`);
  if (!hasUnit && hasRole) validateValue(rawConfig, 'role', 'string');
  if (hasUnit && !hasRole) {
    validateValue(rawConfig, 'unit', 'string');
    if (!Object.keys(unitsConfig).includes(rawConfig.unit as string)) throw Error(`${prefix}: Unit '${rawConfig.unit}' is not defined in config.units`);
  }

  return true;
};
