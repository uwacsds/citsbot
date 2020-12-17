import { Counter } from 'prom-client';

const newUserCount = new Counter({
  name: 'citsbot_welcomer_new_users',
  help: 'count of new users',
});

const dmCount = new Counter({
  name: 'citsbot_welcomer_dm',
  help: 'count of welcome dms sent',
  labelNames: ['instant'],
});

export interface WelcomerEmitter {
  userJoin: () => void;
  dmSent: (instant: boolean) => void;
}

export const welcomerEmitter = (): WelcomerEmitter => ({
  userJoin: () => newUserCount.labels().inc(),
  dmSent: instant => dmCount.labels(String(instant)).inc(),
});
