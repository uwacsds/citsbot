import { Counter, Summary, Histogram, Gauge } from 'prom-client';

const imageScanCount = new Counter({
  name: 'citsbot_anime_detector_images_scanned',
  help: 'count of images scanned by the anime detector',
  labelNames: ['channelId', 'userTag', 'verdict'], // cardinality of userTag might be an issue
});

export interface AnimeDetectorEmitter {
  imageScanned: (channelId: string, userTag: string, verdict: boolean) => void;
}

export const animeDetectorEmitter = (): AnimeDetectorEmitter => ({
  imageScanned: (channelId, userTag, verdict) => imageScanCount.labels(channelId, userTag, String(verdict)).inc(),
});
