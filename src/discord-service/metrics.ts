import { Counter, Gauge } from 'prom-client';

const memberGauge = new Gauge({
  name: 'discord_guild_member_gauge',
  help: 'number of users in a guild',
  labelNames: ['guild'],
});

const memberOnlineGauge = new Gauge({
  name: 'discord_guild_member_online_gauge',
  help: 'number of users online in a guild',
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
  labelNames: ['channelName'],
});

const actionsCount = new Counter({
  name: 'discord_bot_action_counter',
  help: 'count of actions taken by the bot',
  labelNames: ['actionType'],
});

export interface DiscordEmitter {
  memberCount: (guild: string, count: number) => void;
  memberOnlineCount: (guild: string, count: number) => void;
  event: (eventType: string) => void;
  message: (channelName: string) => void;
  action: (actionType: string) => void;
}

export const discordEmitter = (): DiscordEmitter => ({
  memberCount: (guild, count) => memberGauge.labels(guild).set(count),
  memberOnlineCount: (guild, count) => memberOnlineGauge.labels(guild).set(count),
  event: eventType => clientEventCount.labels(eventType).inc(),
  message: channelName => messageCount.labels(channelName).inc(),
  action: actionType => actionsCount.labels(actionType).inc(),
});
