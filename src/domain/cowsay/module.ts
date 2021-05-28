import { DiscordMessage } from '../../discord/types';
import { LoggingService } from '../../utils/logging';
import { BotAction, BotActionType } from '../action-types';
import { CowsayModule, ModuleType } from '../module-types';
import { CowsayFormatter } from './formatter';

export const cowsayModule = (
  { log }: LoggingService,
  globalPrefix: string,
  formatMessage: CowsayFormatter,
): CowsayModule => {

  const onMessage = async (message: DiscordMessage): Promise<BotAction[]> => {
    const prefix = `${globalPrefix}cowsay `;
    if (!message.content.startsWith(prefix)) return [];
    
    const formattedMessage = formatMessage(message.content.slice(prefix.length));
    log(`info`, `Formatted a message`, { title: `Cowsay`, data: { message, formattedMessage } });
    
    return [{ type: BotActionType.Message, channelId: message.channel.id, messageContent: formattedMessage }];
  };

  return { type: ModuleType.Cowsay, onMessage };
};
