import { Counter, Gauge } from 'prom-client';

const memberGauge = new Gauge({
  name: 'discord_guild_member_gauge',
  help: 'number of users in a guild',
  labelNames: ['guild'],
});

const clientEventCount = new Counter({
  name: 'discord_client_event_counter',
  help: 'count of discordjs client events',
  labelNames: ['eventType'],
});

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
  memberCount: (guild: string, count: number) => void;
  event: (eventType: string) => void;
  message: (channelId: string, channelName: string, userTag: string) => void;
  action: (actionType: string) => void;
}

export const discordEmitter = (): DiscordEmitter => ({
  memberCount: (guild, count) => memberGauge.labels(guild).set(count),
  event: (eventType) => clientEventCount.labels(eventType).inc(),
  message: (channelId, channelName, userTag) => messageCount.labels(channelId, channelName, userTag).inc(),
  action: actionType => actionsCount.labels(actionType).inc(),
});
