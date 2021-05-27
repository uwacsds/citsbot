import { DiscordMessage } from '../../discord/types';
import { LoggingService } from '../../utils/logging';
import { BotAction, BotActionType } from '../action-types';
import { BotConfig } from '../config';
import { CowsayModule, ModuleType } from '../module-types';
import { cowsayFormatter } from './formatter';

export const cowsayModule = (config: BotConfig, { log }: LoggingService): CowsayModule => {

  const onMessage = async (message: DiscordMessage): Promise<BotAction[]> => {
    const prefix = `${config.prefix}cowsay `;
    if (!message.content.startsWith(prefix)) return [];

    const formatMessage = cowsayFormatter(config.modules.cowsay);
    const formattedMessage = formatMessage(message.content.slice(prefix.length));
    log(`info`, `Formatted a message`, { title: `Cowsay`, data: { message, formattedMessage } });
    return [{ type: BotActionType.Message, channelId: message.channel.id, messageContent: formattedMessage }];
  };
  return { type: ModuleType.Cowsay, onMessage };
};