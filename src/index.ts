import { promises as fs } from 'fs';
import { discordCommandHandler } from './domain/command-handler';
import { discordApi } from './discord-api/discord-api';
import { BotConfig } from './domain/config';
import { MessageTuple } from './discord-api/types';
import { academicCalendar } from './academic-calendar/academic-caldendar';

const getMessagesToCache = (config: BotConfig): MessageTuple[] => [
    ...config.modules.reactRoles.messages.map((msg): MessageTuple => [msg.channel, msg.id]),
];

const start = async () => {
    const config: BotConfig = JSON.parse(await fs.readFile('./config.json', { encoding: 'utf-8' }));
    const calendar = academicCalendar();
    const commandHandler = discordCommandHandler(config, calendar);
    const { start } = discordApi(commandHandler, getMessagesToCache(config));
    await start();
};

start();
