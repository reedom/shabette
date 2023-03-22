export type VoiceProviderId =
  | 'google';

export type VoiceKey = string; // voiceProviderId "|" voiceId

export function toVoiceKey(providerId: VoiceProviderId, voiceId: string) {
  return `${providerId}|${voiceId}`;
}

export function fromVoiceKey(voiceKey: VoiceKey): { providerId: VoiceProviderId, voiceId: string } {
  const [providerId, voiceId] = voiceKey.split('|');
  return { providerId: (providerId as VoiceProviderId), voiceId };
}

export interface VoiceProvider {
  id: VoiceProviderId;
  name: string;
}

// Provider specific voice definition.
export interface ProviderVoice {
  // voice key. E.g. "google|en-US-Wavenet-A"
  key: VoiceKey;
  // voice provider id. E.g. "google"
  providerId: VoiceProviderId;
  // voice identifier under the provider. E.g. name or URL, etc.
  voiceId: string;
  // language code. E.g. en, ja, etc.
  lang: string;
  // dialect code. E.g. en-US, ja-JP, etc.
  dialect?: string[];
}

export type Gender = 'male' | 'female' | 'neutral';
