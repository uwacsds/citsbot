import { discordCommandHandler } from './domain/command-handler';
import { discordBot } from './discord-service/discord-bot';
import { validateConfig } from './domain/config';
import { academicCalendarService } from './domain/announcer/calendar/service';
import { discordChannelLogger } from './utils/logging';
import { initPushgateway } from './metrics/process';

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
  const commandHandler = discordCommandHandler(env.config, logger, calendar);
  const bot = discordBot(logger, commandHandler, env.config.guild);
  logger.initialise(bot);
  await bot.start(env.discordToken);
  logger.log('notice', 'Bot has started', { title: 'Hello, World' });
};

start();
