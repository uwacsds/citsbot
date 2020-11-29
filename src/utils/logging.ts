import * as winston from 'winston';
import Transport = require('winston-transport');
import { DiscordAPI } from '../discord-api/types';
import { BotActionType, BotEmbeddedMessageAction } from '../domain/action-types';

type LogLevel = 'emerg' | 'alert' | 'crit' | 'error' | 'warning' | 'notice' | 'info' | 'debug';

const logLevels: Record<LogLevel, number> = {
  emerg: 0,
  alert: 1,
  crit: 2,
  error: 3,
  warning: 4,
  notice: 5,
  info: 6,
  debug: 7,
};

interface LogMessageContext {
  title?: string;
  image?: string;
  data?: { [key: string]: any };
}

export interface LoggingService {
  log: (level: LogLevel, message: string, context?: LogMessageContext) => void;
  initialise: (discord: DiscordAPI) => void;
}

const getColour = (level: LogLevel) => {
  switch (level) {
    case 'emerg':
      return '#ff0000';
    case 'alert':
      return '#ff0000';
    case 'crit':
      return '#ff0000';
    case 'error':
      return '#f04747';
    case 'warning':
      return '#fff200';
    case 'notice':
      return '#96f6ff';
    case 'info':
      return '#96f6ff';
    case 'debug':
      return '#e305c5';
    default:
      return '#96f6ff';
  }
};

interface LogInfo {
  level: LogLevel;
  message: string;
  context: LogMessageContext;
}

class DiscordLogTransport extends Transport {
  constructor(private discord: DiscordAPI, private channelId: string, opts?: Transport.TransportStreamOptions) {
    super(opts);
  }

  async log({ level, message, context }: LogInfo, next: () => void) {
    const formatContextData = (context?: LogMessageContext) => {
      const str = JSON.stringify(context?.data) ?? '';
      return `\`\`\`json\n${str.slice(0, 1000).replace(/`/g, '\\`')}'\`\`\``;
    };
    const action: BotEmbeddedMessageAction = {
      type: BotActionType.EmbeddedMessage,
      channelId: this.channelId,
      embed: {
        title: `${level.toUpperCase()}: ${context?.title}`,
        colour: getColour(level),
        image: context?.image,
        fields: [
          { name: 'Time', value: new Date().toJSON() },
          { name: 'Message', value: message },
          { name: 'Context', value: formatContextData(context) },
        ],
      },
    };
    await this.discord.applyAction(action);
    next();
  }
}

export const discordChannelLogger = (channelId: string): LoggingService => {
  let logger: winston.Logger;

  process.on('uncaughtExceptionMonitor', (err: Error, origin: string) => {
    if (!logger) console.error('CRASHED BEFORE LOG INITIALISE:', err);
    logger.log('emerg', 'Uncaught Exception', { title: 'Uncaught Exception', data: { err, origin } });
  });

  return {
    log: (level, message, context = {}) => logger.log(level, message, { context }),
    initialise: (api: DiscordAPI) => {
      logger = winston.createLogger({
        level: 'info',
        levels: logLevels,
        format: winston.format.json(),
        defaultMeta: { service: 'user-service' },
        transports: [new winston.transports.Console(), new DiscordLogTransport(api, channelId, { level: 'notice' })],
      });
    },
  };
};

export const mockLogger = (): LoggingService => ({
  log: () => null,
  initialise: () => null,
});
