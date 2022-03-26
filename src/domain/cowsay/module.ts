import { DiscordMessage } from '../../discord/types';
import { LoggingService } from '../../utils/logging';
import { BotAction, BotActionType } from '../action-types';
import { BotModule } from '../types';
import { CowsayFormatter } from './formatter';

export interface CowsayModule extends BotModule {
  onMessage: (message: DiscordMessage) => Promise<BotAction[]>;
}

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

  return { onMessage };
};
