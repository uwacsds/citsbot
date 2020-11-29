import { discordCommandHandler } from './domain/command-handler';
import { discordApi } from './discord-api/discord-api';
import { BotConfig, loadConfig } from './domain/config';
import { MessageTuple } from './discord-api/types';
import { academicCalendarService } from './academic-calendar/academic-calendar-service';
import { academicWeeksParser } from './academic-calendar/weeks-parser';
import { academicDeadlinesParser } from './academic-calendar/deadlines-parser';
import { discordChannelLogger } from './utils/logging';

const env = {
  CONFIG: process.env.CONFIG as string,
  DISCORD_ID: process.env.DISCORD_ID as string,
  DISCORD_SECRET: process.env.DISCORD_SECRET as string,
  DISCORD_TOKEN: process.env.DISCORD_TOKEN as string,
};

const getMessagesToCache = (config: BotConfig): MessageTuple[] => [...config.modules.reactRoles.messages.map((msg): MessageTuple => [msg.channel, msg.id])];

const start = async () => {
  const config = await loadConfig(env.CONFIG);
  const logger = discordChannelLogger(config.logChannel);
  const calendar = academicCalendarService(logger, academicWeeksParser(), academicDeadlinesParser());
  const commandHandler = discordCommandHandler(config, logger, calendar);
  const discord = discordApi(logger, commandHandler, getMessagesToCache(config));
  logger.initialise(discord);
  await discord.start(env.DISCORD_TOKEN);
};

start();
