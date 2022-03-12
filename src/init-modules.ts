import { validateAnimeDetectorConfig } from './domain/anime-detector/config';
import { animeDetectorService } from './domain/anime-detector/detector-service';
import { keywordCounterService } from './domain/anime-detector/keyword-counter';
import { animeDetectorEmitter } from './domain/anime-detector/metrics';
import { animeDetectorModule } from './domain/anime-detector/module';
import { reverseImageSearchService } from './domain/anime-detector/reverse-image-search';
import { imgurImageUploaderService } from './domain/anime-detector/upload-image-service';
import { BotConfig } from './domain/config';
import { validateCowsayConfig } from './domain/cowsay/config';
import { cowsayFormatter } from './domain/cowsay/formatter';
import { cowsayModule } from './domain/cowsay/module';
import { BotModule } from './domain/module-types';
import { validateReactRolesConfig } from './domain/react-roles/config';
import { reactRolesModule } from './domain/react-roles/module';
import { validateWelcomerConfig } from './domain/welcomer/config';
import { welcomerEmitter } from './domain/welcomer/metrics';
import { welcomerModule } from './domain/welcomer/module';
import { LoggingService } from './utils/logging';

export const initialiseModules = (
  config: BotConfig,
  logger: LoggingService,
  imgurClientId: string,
): BotModule[] => {

  const initialiseWelcomer = () =>
    config.modules.welcomer !== undefined
      ? [welcomerModule(logger, welcomerEmitter(), validateWelcomerConfig(config.modules.welcomer))]
      : [];

  const initialiseCowsay = () =>
    config.modules.cowsay !== undefined
      ? [cowsayModule(logger, config.prefix, cowsayFormatter(validateCowsayConfig(config.modules.cowsay)))]
      : [];

  const initialiseReactRoles = () =>
    config.modules.reactRoles !== undefined
      ? [reactRolesModule(logger, validateReactRolesConfig(config.modules.reactRoles, config.units ?? {}), config.units ?? {})]
      : [];

  const initialiseAnimeDetector = () =>
    config.modules.animeDetector !== undefined
      ? [animeDetectorModule(logger, animeDetectorEmitter(), animeDetectorService(validateAnimeDetectorConfig(config.modules.animeDetector), reverseImageSearchService(logger), keywordCounterService(logger)), imgurImageUploaderService(imgurClientId))]
      : [];

  return [
    ...initialiseWelcomer(),
    ...initialiseCowsay(),
    ...initialiseReactRoles(),
    ...initialiseAnimeDetector(),
  ];
};
