import { LoggingService } from '../../utils/logging';
import { BotActionType } from '../action-types';
import { BotConfig } from '../config';
import { CowsayModule, ModuleType } from '../module-types';
import { cowsayFormatter } from './formatter';

export interface CowsayConfig {
  lineMaxLen: number;
  cowArt: string;
}

export const cowsayModule = (config: BotConfig, { log }: LoggingService): CowsayModule => ({
  type: ModuleType.Cowsay,
  onMessage: async message => {
    const formatMessage = cowsayFormatter(config.modules.cowsay);

    const prefix = `${config.prefix}cowsay `;
    if (!message.content.startsWith(prefix)) return { type: BotActionType.Nothing };

    const formattedMessage = formatMessage(message.content.slice(prefix.length));
    log('info', 'Formatted a message', { title: 'Cowsay', data: { message, formattedMessage } });
    return { type: BotActionType.Message, channelId: message.channel.id, messageContent: formattedMessage };
  },
});
