import { fieldValidator } from '../../utils/validation';

export type WelcomerConfig = {
  channel: string;
  newMemberDm: WelcomerNewMemberDmConfig;
}

type WelcomerNewMemberDmConfig = {
  delay: number;
  roleThreshold: number;
  instantAccountAge: number;
  message: string;
}

export const validateWelcomerConfig = (rawConfig: Record<string, unknown>): WelcomerConfig => {
  const { validateValue } = fieldValidator(`Config Validation: modules.welcomer`);
  validateValue(rawConfig, `channel`, `string`);
  validateNewMemberDm(rawConfig.newMemberDm as Record<string, unknown>);
  return rawConfig as WelcomerConfig;
};

const validateNewMemberDm = (rawConfig: Record<string, unknown>): rawConfig is WelcomerNewMemberDmConfig => {
  const { validateValue } = fieldValidator(`Config Validation: modules.welcomer.newMemberDm`);
  validateValue(rawConfig, `delay`, `number`);
  validateValue(rawConfig, `roleThreshold`, `number`);
  validateValue(rawConfig, `instantAccountAge`, `number`);
  validateValue(rawConfig, `message`, `string`);
  return true;
};
