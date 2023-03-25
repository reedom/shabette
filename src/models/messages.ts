import { ProviderVoice, VoiceProvider, VoiceProviderId } from './voiceProviders';
import { VoicePreference } from './preference';

export type BackgroundMessage =
  | { type: 'listProviders'}
  | { type: 'listVoices', providerId: VoiceProviderId, lang: string }
  | { type: 'synthesize', providerId: VoiceProviderId, voiceId: string, text: string }
  | { type: 'preference.selectVoice', lang: string, providerId: VoiceProviderId, voiceId: string }
  | { type: 'preference.selectedVoice', lang: string }
  | { type: 'preference.pinVoice', lang: string, providerId: VoiceProviderId, voiceId: string, pin: boolean }
  | { type: 'preference.pinnedVoices', lang: string }
  | { type: 'preference.listVoices' }

type BackgroundMessageReturnType<T> =
  T extends { type: 'listProviders' } ? VoiceProvider[] :
  T extends { type: 'listVoices', providerId: VoiceProviderId, lang: string } ? ProviderVoice[] | string :
  T extends { type: 'synthesize', providerId: VoiceProviderId, voiceId: string, text: string } ? string :
  T extends { type: 'preference.selectVoice', lang: string, providerId: VoiceProviderId, voiceId: string } ? void :
  T extends { type: 'preference.selectedVoice', lang: string } ? { providerId: VoiceProviderId, voiceId: string } | undefined :
  T extends { type: 'preference.pinVoice', lang: string, providerId: VoiceProviderId, voiceId: string, pin: boolean } ? void :
  T extends { type: 'preference.pinnedVoices', lang: string } ? { providerId: VoiceProviderId, voiceId: string }[]:
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

// Save the selected voice for the given language.
export async function selectVoice(args: { lang: string, providerId: VoiceProviderId, voiceId: string }): Promise<void> {
  return await sendBackgroundMessage({ type: 'preference.selectVoice', ...args });
}

// Return selected voice for the given language.
export async function getSelectedVoice(lang: string): Promise<{ providerId: VoiceProviderId, voiceId: string } | undefined> {
  return await sendBackgroundMessage({ type: 'preference.selectedVoice', lang });
}

// Save the selected voice for the given language.
export async function pinVoice(args: { lang: string, providerId: VoiceProviderId, voiceId: string, pin: boolean }): Promise<void> {
  return await sendBackgroundMessage({ type: 'preference.pinVoice', ...args });
}

// Return selected voice for the given language.
export async function getPinnedVoices(lang: string): Promise<{ providerId: VoiceProviderId, voiceId: string }[]> {
  return await sendBackgroundMessage({ type: 'preference.pinnedVoices', lang });
}
