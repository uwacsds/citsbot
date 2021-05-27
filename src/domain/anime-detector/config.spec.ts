import { AnimeDetectorConfig, validateAnimeDetectorConfig } from './config';

describe(`cowsay config`, () => {
  const validConfig: AnimeDetectorConfig = {
    keywords: [`keyword-123`, `keyword-234`, `keyword-345`],
    keywordCountThreshold: 5,
  };

  test(`given valid config > when validate > should return valid config`, () => {
    expect(validateAnimeDetectorConfig(validConfig)).toEqual(validConfig);
  });

  test(`given invalid keywordCountThreshold > when validate > should throw`, () => {
    const rawConfig = { ...validConfig, keywordCountThreshold: undefined };
    expect(() => validateAnimeDetectorConfig(rawConfig)).toThrowError(`Config Validation: modules.cowsay: Expected 'keywordCountThreshold' to have type 'number', got 'undefined'`);
  });

  test(`given invalid keywords > when validate > should throw`, () => {
    const rawConfig = { ...validConfig, keywords: undefined };
    expect(() => validateAnimeDetectorConfig(rawConfig)).toThrowError(`Config Validation: modules.cowsay: Expected 'keywords' to have type 'array', got 'undefined'`);
  });

  test(`given invalid keyword type > when validate > should throw`, () => {
    const rawConfig = { ...validConfig, keywords: [...validConfig.keywords, 123] };
    expect(() => validateAnimeDetectorConfig(rawConfig)).toThrowError(`Config Validation: modules.cowsay.keywords[3]: Expected element to have type 'string', got 'number'`);
  });
});
