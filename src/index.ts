import { discordCommandHandler } from './domain/command-handler';
import { discordApi } from './discord-api/discord-api';
import { BotConfig, loadConfig } from './domain/config';
import { MessageTuple } from './discord-api/types';
import { academicCalendarService } from './academic-calendar/academic-calendar-service';

const getMessagesToCache = (config: BotConfig): MessageTuple[] => [
  ...config.modules.reactRoles.messages.map((msg): MessageTuple => [msg.channel, msg.id]),
];

const start = async () => {
  const config = await loadConfig('./config.json');
  const calendar = academicCalendarService();
  const commandHandler = discordCommandHandler(config, calendar);
  const { start } = discordApi(commandHandler, getMessagesToCache(config));
  await start();
};

start();
