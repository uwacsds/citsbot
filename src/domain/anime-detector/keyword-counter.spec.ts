import { mockLogger } from '../../utils/logging';
import { keywordCounterService } from './keyword-counter';

describe(`keyword counter service`, () => {
  const countKeywords = keywordCounterService(mockLogger());

  test(`given text with keywords > when count > should return expected counts`, () => {
    expect(countKeywords(`this contains anime keywords like anime and manga manga anime test`, [`anime`, `manga`])).toEqual({ [`anime`]: 3, [`manga`]: 2 });
  });

  test(`given text with no keywords > when count > should return expected counts`, () => {
    expect(countKeywords(`this does not contain keywords`, [`anime`, `manga`])).toEqual({ [`anime`]: 0, [`manga`]: 0 });
  });
  
  test(`given text contains keywords but they are substrings of other longer words > when count > should not count sub words as keywords`, () => {
    expect(countKeywords(`the element manganese is not a japanese cartoon`, [`anime`, `manga`])).toEqual({ [`anime`]: 0, [`manga`]: 0 });
  });
});
