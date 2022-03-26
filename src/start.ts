import { discordBot } from './discord/discord-bot';
import { discordChannelLogger } from './utils/logging';
import { initPushgateway } from './metrics/process';
import { validateBotConfig } from './domain/config';
import { initialiseModules } from './init-modules';

const env = {
  pushgatewayUrl: process.env.PUSHGATEWAY_URL,
  config: JSON.parse(process.env.CONFIG ?? `{}`),
  discordToken: process.env.DISCORD_TOKEN as string,
  imgurClientId: process.env.IMGUR_CLIENT_ID as string,
};

const start = async () => {
  initPushgateway(env.pushgatewayUrl);
  const logger = discordChannelLogger(env.config.logChannel);
  const config = validateBotConfig(env.config);

  const modules = initialiseModules(config, logger, env.imgurClientId);
  const bot = discordBot(logger, env.config.guild, modules);
  logger.initialise(bot);
  await bot.start(env.discordToken);
  logger.log(`notice`, `Bot has started`, { title: `Hello, World` });
};

start();
