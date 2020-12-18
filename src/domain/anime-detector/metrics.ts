import { Counter } from 'prom-client';

const imageScanCount = new Counter({
  name: 'citsbot_anime_detector_images_scanned',
  help: 'count of images scanned by the anime detector',
  labelNames: ['channelId', 'verdict'],
});

export interface AnimeDetectorEmitter {
  imageScanned: (channelId: string, verdict: boolean) => void;
}

export const animeDetectorEmitter = (): AnimeDetectorEmitter => ({
  imageScanned: (channelId, verdict) => imageScanCount.labels(channelId, String(verdict)).inc(),
});
