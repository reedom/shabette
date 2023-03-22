import { Gender, VoiceKey, VoiceProviderId } from './voiceProviders';

export interface VoicePreference {
  // voice key. E.g. "google|en-US-Wavenet-A"
  key: VoiceKey;
  // voice provider id. E.g. "google"
  providerId: VoiceProviderId;
  // voice identifier under the provider. E.g. name or URL, etc.
  voiceId: string;
  // language code. E.g. en, ja, etc.
  lang: string;
  // dialect code. E.g. en-US, ja-JP, etc.
  dialect?: string;
  // provider specific voice options.
  voiceOptions?: any;
}
export interface GoogleVoiceOptions {
  speed?: number;
  pitch?: number;
  gender?: Gender;
  volume?: number;
}
