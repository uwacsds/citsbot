import { Pushgateway } from 'prom-client';

export const initPushgateway = (url: string, environment: string) => {
  const pushgateway = new Pushgateway(url);
  return setInterval(() => pushgateway.pushAdd({ jobName: `citsbot-${environment}` }, () => { }), 5000);
};
