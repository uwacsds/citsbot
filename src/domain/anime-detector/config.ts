import { fieldValidator, validString } from '../../utils/validation';

export type AnimeDetectorConfig = {
  keywords: string[];
  keywordCountThreshold: number;
}

export const validateAnimeDetectorConfig = (rawConfig: Record<string, unknown>): AnimeDetectorConfig => {
  const { validateValue, validateArray } = fieldValidator(`Config Validation: modules.animeDetector`);
  validateArray(rawConfig, `keywords`, validateKeyWord);
  validateValue(rawConfig, `keywordCountThreshold`, `number`);
  return rawConfig as AnimeDetectorConfig;
};

const validateKeyWord = (keyword: unknown, keywordIdx: number): keyword is string => {
  const prefix = `Config Validation: modules.animeDetector.keywords[${keywordIdx}]`;
  if (!validString(keyword)) throw Error(`${prefix}: Expected element to have type 'string', got '${typeof keyword}'`);
  return true;
};
