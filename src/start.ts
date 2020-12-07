import { discordCommandHandler } from './domain/command-handler';
import { discordBot } from './discord-service/discord-bot';
import { BotConfig } from './domain/config';
import { MessageTuple } from './discord-service/types';
import { academicCalendarService } from './academic-calendar/academic-calendar-service';
import { academicWeeksParser } from './academic-calendar/weeks-parser';
import { academicDeadlinesParser } from './academic-calendar/deadlines-parser';
import { discordChannelLogger } from './utils/logging';

const env = {
  CONFIG: JSON.parse(process.env.CONFIG ?? '{}') as BotConfig,
  DISCORD_TOKEN: process.env.DISCORD_TOKEN as string,
};

const getMessagesToCache = (config: BotConfig): MessageTuple[] => [...config.modules.reactRoles.messages.map((msg): MessageTuple => [msg.channel, msg.id])];

const start = async () => {
  const logger = discordChannelLogger(env.CONFIG.logChannel);
  const calendar = academicCalendarService(logger, academicWeeksParser(), academicDeadlinesParser());
  const commandHandler = discordCommandHandler(env.CONFIG, logger, calendar);
  const bot = discordBot(logger, commandHandler, getMessagesToCache(env.CONFIG), env.CONFIG.guild);
  logger.initialise(bot);
  await bot.start(env.DISCORD_TOKEN);
};

start();
