import { ProviderVoice, VoiceKey, VoiceProvider, VoiceProviderId } from './voiceProviders';
import { VoicePreference } from './preference';

export type BackgroundMessage =
  | { type: 'listProviders' }
  | { type: 'listVoices', providerId: VoiceProviderId }
  | { type: 'synthesize', providerId: VoiceProviderId, voiceId: string, text: string }
  | { type: 'ui.selectVoiceProvider', providerId: VoiceProviderId }
  | { type: 'ui.selectedVoiceProvider' }
  | { type: 'preference.selectVoice', voice: ProviderVoice }
  | { type: 'preference.selectedVoice' }
  | { type: 'preference.pinVoice', lang: string, providerId: VoiceProviderId, voiceId: string, pin: boolean }
  | { type: 'preference.pinnedVoices' }
  | { type: 'preference.listVoices' }

type BackgroundMessageReturnType<T> =
  T extends { type: 'listProviders' } ? VoiceProvider[] :
  T extends { type: 'listVoices', providerId: VoiceProviderId } ? ProviderVoice[] | string :
  T extends { type: 'synthesize', providerId: VoiceProviderId, voiceId: string, text: string } ? string :
  T extends { type: 'ui.selectVoiceProvider', providerId: VoiceProviderId } ? void :
  T extends { type: 'ui.selectedVoiceProvider' } ? VoiceProviderId :
  T extends { type: 'preference.selectVoice', voice: ProviderVoice } ? void :
  T extends { type: 'preference.selectedVoice' } ? ProviderVoice | undefined :
  T extends { type: 'preference.pinVoice', lang: string, providerId: VoiceProviderId, voiceId: string, pin: boolean } ? void :
  T extends { type: 'preference.pinnedVoices' } ? { voiceKey: VoiceKey, providerId: VoiceProviderId, voiceId: string }[] :
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

// Return available providers.
export async function listVoiceProviders(): Promise<VoiceProvider[]> {
  return sendBackgroundMessage({ type: 'listProviders' });
}

// Return available voices.
export async function listVoices(args: { providerId: VoiceProviderId }): Promise<ProviderVoice[]> {
  const res = await sendBackgroundMessage({ type: 'listVoices', ...args });
  if (typeof res === 'string') {
    throw new Error(res);
  }
  return res;
}

// Save the selected voice for the given language.
export function selectVoiceProvider(providerId: VoiceProviderId) {
  sendBackgroundMessage({ type: 'ui.selectVoiceProvider', providerId }).catch(console.error);
}

// Return selected voice for the given language.
export async function getSelectedVoiceProvider(): Promise<VoiceProviderId> {
  return await sendBackgroundMessage({ type: 'ui.selectedVoiceProvider' });
}

// Save the selected voice for the given language.
export function selectVoice(voice: ProviderVoice ) {
  sendBackgroundMessage({ type: 'preference.selectVoice', voice }).catch(console.error);
}

// Return selected voice for the given language.
export async function getSelectedVoice(): Promise<ProviderVoice | undefined> {
  return await sendBackgroundMessage({ type: 'preference.selectedVoice' });
}

// Save the selected voice for the given language.
export function pinVoice(args: { lang: string, providerId: VoiceProviderId, voiceId: string, pin: boolean }) {
  sendBackgroundMessage({ type: 'preference.pinVoice', ...args }).catch(console.error);
}

// Return selected voice for the given language.
export async function getPinnedVoices(): Promise<{ voiceKey: VoiceKey, providerId: VoiceProviderId, voiceId: string }[]> {
  return await sendBackgroundMessage({ type: 'preference.pinnedVoices' });
}
