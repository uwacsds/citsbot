import { discordCommandHandler } from './domain/command-handler';
import { discordApi } from './discord-api/discord-api';
import { BotConfig, loadConfig } from './domain/config';
import { MessageTuple } from './discord-api/types';
import { academicCalendarService } from './academic-calendar/academic-calendar-service';
import { academicWeeksParser } from './academic-calendar/weeks-parser';
import { academicDeadlinesParser } from './academic-calendar/deadlines-parser';

const env = {
  CONFIG: process.env.CONFIG as string,
  DISCORD_ID: process.env.DISCORD_ID as string,
  DISCORD_SECRET: process.env.DISCORD_SECRET as string,
  DISCORD_TOKEN: process.env.DISCORD_TOKEN as string,
};

const getMessagesToCache = (config: BotConfig): MessageTuple[] => [
  ...config.modules.reactRoles.messages.map((msg): MessageTuple => [msg.channel, msg.id]),
];

const start = async () => {
  const config = await loadConfig(env.CONFIG);
  const calendar = academicCalendarService(academicWeeksParser(), academicDeadlinesParser());
  const commandHandler = discordCommandHandler(config, calendar);
  const { start } = discordApi(commandHandler, getMessagesToCache(config));
  await start(env.DISCORD_TOKEN);
};

start();
