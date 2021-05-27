import { Pushgateway } from 'prom-client';

export const initPushgateway = (environment: string, url: string | undefined) => {
  if (!url) {
    console.log(`No pushgateway URL provided for ${environment}. No metrics will be pushed.`);
    return setInterval(() => undefined, 5000);
  }
  const pushgateway = new Pushgateway(url);
  return setInterval(() => pushgateway.pushAdd({ jobName: `citsbot-${environment}` }, () => undefined), 5000);
};
