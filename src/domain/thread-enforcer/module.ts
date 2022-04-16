import { DiscordChannel, DiscordMessage } from '../../discord/types';
import { LoggingService } from '../../utils/logging';
import { unwrap } from '../../utils/unwrap';
import { BotAction, BotActionType } from '../action-types';
import { BotModule } from '../types';
import { ThreadEnforcerConfig } from './config';
import { ThreadEnforcerEmitter } from './metrics';

export interface ThreadEnforcerModule extends BotModule {
  onMessage: (message: DiscordMessage) => Promise<BotAction[]>;
}

export const threadEnforcerModule = (
  { log }: LoggingService,
  emitter: ThreadEnforcerEmitter,
  config: ThreadEnforcerConfig,
): ThreadEnforcerModule => {

  const findChannelConfig = (channel: DiscordChannel) => config.channels.find(({ channelId }) => channelId === channel.id);

  const isEnforcementEnabledForChannel = (channel: DiscordChannel) => findChannelConfig(channel) !== undefined;

  const containsHttpUrl = (text: string) => /https?:\/\/(.+)\.(.+)/ig.exec(text) !== null;

  const isMessageInViolation = ({ channel, content, isSystemMessage }: DiscordMessage) =>
    !isSystemMessage &&
    isEnforcementEnabledForChannel(channel) &&
    !containsHttpUrl(content);

  const formatRuleBreakDirectMessage = ({ channel, author: { username } }: DiscordMessage) => {
    const channelConfig = findChannelConfig(channel);
    return config.ruleBreakDm
      .replaceAll(`{username}`, unwrap(username))
      .replaceAll(`{channelName}`, unwrap(channelConfig?.channelName))
      .replaceAll(`{topicSingular}`, unwrap(channelConfig?.topicSingular))
      .replaceAll(`{topicPlural}`, unwrap(channelConfig?.topicPlural))
    ;
  };

  const onMessage = async (message: DiscordMessage): Promise<BotAction[]> => {
    if (!isMessageInViolation(message)) return [];

    log(`notice`, `Enforced thread channel rules`, { title: `Thread Channel Enforcer`, data: { message } });
    const channelConfig = unwrap(findChannelConfig(message.channel));
    emitter.messageDeleted(channelConfig.channelName);

    return [
      {
        type: BotActionType.RemoveMessage,
        channelId: message.channel.id,
        messageId: message.id,
      },
      {
        type: BotActionType.DirectMessage,
        userId: message.author.id,
        messageContent: formatRuleBreakDirectMessage(message),
      },
    ];
  };

  return { onMessage };
};
