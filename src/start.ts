import { discordBot } from './discord-service/discord-bot';
import { validateConfig } from './domain/config';
import { academicCalendarService } from './domain/announcer/calendar/service';
import { discordChannelLogger } from './utils/logging';
import { initPushgateway } from './metrics/process';
import { animeDetectorModule } from './domain/anime-detector/module';
import { announcerModule } from './domain/announcer/module';
import { cowsayModule } from './domain/cowsay/module';
import { reactRolesModule } from './domain/react-roles/module';
import { welcomerModule } from './domain/welcomer/module';

const env = {
  environment: process.env.ENVIRONMENT as string,
  pushgatewayUrl: process.env.PUSHGATEWAY_URL,
  config: validateConfig(JSON.parse(process.env.CONFIG ?? '{}')),
  discordToken: process.env.DISCORD_TOKEN as string,
};

const start = async () => {
  initPushgateway(env.environment, env.pushgatewayUrl);
  const logger = discordChannelLogger(env.config.logChannel);
  const calendar = academicCalendarService(logger, 'https://ipoint.uwa.edu.au/app/answers/detail/a_id/1241', 'https://secure.csse.uwa.edu.au/run/cssubmit');

  const modules = [
    announcerModule(env.config.modules.announcer, logger, calendar),
    welcomerModule(env.config.modules.welcomer, logger),
    cowsayModule(env.config, logger),
    reactRolesModule(env.config.modules.reactRoles, logger, env.config.units),
    animeDetectorModule(env.config.modules.animeDetector, logger),
  ];

  const bot = discordBot(logger, env.config.guild, modules);
  logger.initialise(bot);
  await bot.start(env.discordToken);
  logger.log('notice', 'Bot has started', { title: 'Hello, World' });
};

start();
