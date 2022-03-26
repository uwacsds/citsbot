import { Counter } from 'prom-client';

const messagedDeletedCount = new Counter({
  name: `citsbot_thread_channel_enforcer_messages_deleted`,
  help: `count of messages delete`,
  labelNames: [`channel`],
});

export interface ThreadEnforcerEmitter {
  messageDeleted: (channel: string) => void;
}

export const threadEnforcerEmitter = (): ThreadEnforcerEmitter => ({
  messageDeleted: channel => messagedDeletedCount.labels(channel).inc(),
});
