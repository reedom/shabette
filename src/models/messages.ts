import { ProviderVoice, VoiceProvider, VoiceProviderId } from './voiceProviders';
import { VoicePreference } from './preference';

export type BackgroundMessage =
  | { type: 'listProviders'}
  | { type: 'listVoices', providerId: VoiceProviderId, lang: string }
  | { type: 'synthesize', providerId: VoiceProviderId, voiceId: string, text: string }
  | { type: 'googleStoreApiKey', apiKey: string }
  | { type: 'preference.setVoice', lang: string, providerId: VoiceProviderId, voiceId: string }
  | { type: 'preference.listVoices' }

type BackgroundMessageReturnType<T> =
  T extends { type: 'listProviders' } ? VoiceProvider[] :
  T extends { type: 'listVoices', providerId: VoiceProviderId, lang: string } ? ProviderVoice[] | string :
  T extends { type: 'synthesize', providerId: VoiceProviderId, voiceId: string, text: string } ? string :
  T extends { type: 'googleStoreApiKey', apiKey: string } ? string :
  T extends { type: 'preference.setVoice', lang: string, providerId: VoiceProviderId, voiceId: string } ? string :
  T extends { type: 'preference.listVoices' } ? VoicePreference[] :
  never;

export async function sendBackgroundMessage<M extends BackgroundMessage>(msg: M): Promise<BackgroundMessageReturnType<M>> {
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage(msg, resolve);
    } catch (e) {
      reject(e);
    }
  });
}

// Return available voices for the given language.
export async function listVoices(args: {providerId: VoiceProviderId, lang: string}): Promise<ProviderVoice[]> {
  const res = await sendBackgroundMessage({ type: 'listVoices', ...args });
  if (typeof res === 'string') {
    throw new Error(res);
  }
  return res;
}
