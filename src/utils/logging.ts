import * as winston from 'winston';
import Transport from 'winston-transport';
import { DiscordBot } from '../discord/types';
import { BotEmbeddedMessageAction, BotActionType } from '../domain/action-types';

type LogLevel = `emerg` | `alert` | `crit` | `error` | `warning` | `notice` | `info` | `debug`;

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: { [key: string]: any };
}

export interface LoggingService {
  log: (level: LogLevel, message: string, context?: LogMessageContext) => void;
  initialise: (bot: DiscordBot) => void;
}

const getColour = (level: LogLevel) => {
  switch (level) {
    case `emerg`:
      return `#ff0000`;
    case `alert`:
      return `#ff0000`;
    case `crit`:
      return `#ff0000`;
    case `error`:
      return `#f04747`;
    case `warning`:
      return `#fff200`;
    case `notice`:
      return `#96f6ff`;
    case `info`:
      return `#96f6ff`;
    case `debug`:
      return `#e305c5`;
    default:
      return `#96f6ff`;
  }
};

interface LogInfo {
  level: LogLevel;
  message: string;
  context: LogMessageContext;
}

class DiscordLogTransport extends Transport {
  constructor(private bot: DiscordBot, private channelId: string, opts?: Transport.TransportStreamOptions) {
    super(opts);
  }

  async log({ level, message, context }: LogInfo, next: () => void) {
    const formatContextData = (context?: LogMessageContext) => {
      const str = JSON.stringify(context?.data) ?? ``;
      if (str === ``) return undefined;
      return `\`\`\`json\n${str.slice(0, 1000).replaceAll(`\``, `\\\``)}\`\`\``;
    };
    const action: BotEmbeddedMessageAction = {
      type: BotActionType.EmbeddedMessage,
      channelId: this.channelId,
      embed: {
        title: `${level.toUpperCase()}: ${context?.title}`,
        colour: getColour(level),
        image: context?.image,
        fields: [
          { name: `Time`, value: new Date().toJSON() },
          { name: `Message`, value: message },
        ],
      },
    };
    const contextField = formatContextData(context);
    if (contextField) action.embed.fields?.push({ name: `Context`, value: contextField });
    await this.bot.applyAction(action);
    next();
  }
}

export const discordChannelLogger = (channelId: string): LoggingService => {
  let logger: winston.Logger;

  process.on(`uncaughtExceptionMonitor`, (err: Error, origin: string) => {
    if (!logger) console.error(`CRASHED BEFORE LOG INITIALISE:`, err);
    logger.log(`emerg`, `Uncaught Exception`, { title: `Uncaught Exception`, data: { err, origin } });
  });

  return {
    log: (level, message, context = {}) => logger.log(level, message, { context }),
    initialise: (bot: DiscordBot) => {
      logger = winston.createLogger({
        level: `info`,
        levels: logLevels,
        format: winston.format.json(),
        defaultMeta: { service: `user-service` },
        transports: [new winston.transports.Console(), new DiscordLogTransport(bot, channelId, { level: `notice` })],
      });
    },
  };
};

export const mockLogger = (): LoggingService => ({
  log: () => undefined,
  initialise: () => undefined,
});
