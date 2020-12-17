import { Counter, Summary, Histogram, Gauge } from 'prom-client';

const messageCount = new Counter({
  name: 'discord_message_counter',
  help: 'count of messages sent by users in the server',
  labelNames: ['channelId', 'channelName', 'userTag'], // cardinality of userTag might be an issue 
});

const actionsCount = new Counter({
  name: 'discord_bot_action_counter',
  help: 'count of actions taken by the bot',
  labelNames: ['actionType'],
});

export interface DiscordEmitter {
  message: (channelId: string, channelName: string, userTag: string) => void
  action: (actionType: string) => void
}

export const discordEmitter = (): DiscordEmitter => ({
  message: (channelId, channelName, userTag) => messageCount.labels(channelId, channelName, userTag).inc(),
  action: (actionType) => actionsCount.labels(actionType).inc(),
});
