import { fieldValidator } from '../../utils/validation';

export type CowsayConfig = {
  lineMaxLen: number;
  cowArt: string;
}

export const validateCowsayConfig = (rawConfig: Record<string, unknown>): CowsayConfig => {
  const { validateValue } = fieldValidator(`Config Validation: modules.cowsay`);
  validateValue(rawConfig, `lineMaxLen`, `number`);
  validateValue(rawConfig, `cowArt`, `string`);
  return rawConfig as CowsayConfig;
};
