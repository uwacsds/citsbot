import { discordBot } from './discord/discord-bot';
import { discordChannelLogger } from './utils/logging';
import { initPushgateway } from './metrics/process';
import { animeDetectorModule } from './domain/anime-detector/module';
import { cowsayModule } from './domain/cowsay/module';
import { reactRolesModule } from './domain/react-roles/module';
import { welcomerEmitter } from './domain/welcomer/metrics';
import { validateWelcomerConfig } from './domain/welcomer/config';
import { validateBotConfig } from './domain/config';
import { welcomerModule } from './domain/welcomer/module';
import { cowsayFormatter } from './domain/cowsay/formatter';
import { validateCowsayConfig } from './domain/cowsay/config';
import { validateReactRolesConfig } from './domain/react-roles/config';
import { animeDetectorEmitter } from './domain/anime-detector/metrics';
import { animeDetectorService } from './domain/anime-detector/detector-service';
import { validateAnimeDetectorConfig } from './domain/anime-detector/config';
import { reverseImageSearchService } from './domain/anime-detector/reverse-image-search';
import { keywordCounterService } from './domain/anime-detector/keyword-counter';

const env = {
  environment: process.env.ENVIRONMENT as string,
  pushgatewayUrl: process.env.PUSHGATEWAY_URL,
  config: JSON.parse(process.env.CONFIG ?? `{}`),
  discordToken: process.env.DISCORD_TOKEN as string,
};

const start = async () => {
  initPushgateway(env.environment, env.pushgatewayUrl);
  const logger = discordChannelLogger(env.config.logChannel);
  const config = validateBotConfig(env.config);

  const modules = [
    welcomerModule(logger, welcomerEmitter(), validateWelcomerConfig(config.modules.welcomer)),
    cowsayModule(logger, config.prefix, cowsayFormatter(validateCowsayConfig(config.modules.cowsay))),
    reactRolesModule(logger, validateReactRolesConfig(config.modules.reactRoles,config.units), config.units),
    animeDetectorModule(logger, animeDetectorEmitter(), animeDetectorService(validateAnimeDetectorConfig(config.modules.animeDetector), reverseImageSearchService(logger), keywordCounterService(logger))),
  ];

  const bot = discordBot(logger, env.config.guild, modules);
  logger.initialise(bot);
  await bot.start(env.discordToken);
  logger.log(`notice`, `Bot has started`, { title: `Hello, World` });
};

start();
