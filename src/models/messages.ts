import { ProviderId } from './consts';

export type BackgroundMessage =
  | { type: 'listProviders'}
  | { type: 'listVoices', providerId: ProviderId, lang: string }
  | { type: 'synthesize', providerId: ProviderId, voiceId: string, text: string }
  | { type: 'googleStoreApiKey', apiKey: string }
  | { type: 'preference.setVoice', lang: string, providerId: ProviderId, voiceId: string }
  | { type: 'preference.listVoices' }
