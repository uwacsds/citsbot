import client, { Pushgateway } from 'prom-client';

export const initPushgateway = (url: string | undefined, instance: string, guild: string) => {
  if (!url) {
    console.log(`No pushgateway URL provided. No metrics will be pushed.`);
    return setInterval(() => undefined, 5_000);
  }
  client.register.setDefaultLabels({ instance, guild });
  const pushgateway = new Pushgateway(url, undefined, client.register);
  return setInterval(() => pushgateway.pushAdd({ jobName: `citsbot` }), 5_000);
};
