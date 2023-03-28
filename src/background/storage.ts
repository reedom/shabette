import { ProviderVoice, VoiceKey, VoiceProviderId } from '../models/voiceProviders';

export namespace AppStorage {
  export interface VoiceOptions {
    [key: VoiceKey]: any;
  }

  export async function getSelectedVoiceProvider(): Promise<VoiceProviderId | null> {
    const key = `prefs.selectedVoiceProvider`;
    const item = await chrome.storage.sync.get({ [key]: null });
    return item[key];
  }

  export function setSelectedVoiceProvider(providerId: VoiceProviderId) {
    const key = `prefs.selectedVoiceProvider`;
    const item = { [key]: providerId };
    chrome.storage.sync.set(item).catch(console.error);
  }

  export async function getSelectedVoice(): Promise<ProviderVoice | null> {
    const key = `prefs.selectedVoice`;
    const item = await chrome.storage.sync.get({ [key]: null });
    return item[key];
  }

  export function setSelectedVoice(voice: ProviderVoice) {
    const key = `prefs.selectedVoice`;
    const item = { [key]: voice };
    chrome.storage.sync.set(item).catch(console.error);
  }

  export async function getPinnedLangs(): Promise<string[]> {
    const key = `prefs.pinnedLang`;
    const item = await chrome.storage.sync.get({ [key]: [] });
    return item[key];
  }

  export function setPinnedLangs(langs: string[]) {
    const key = `prefs.pinnedLang`;
    const item = { [key]: langs };
    chrome.storage.sync.set(item).catch(console.error);
  }

  export async function getPinnedVoices(): Promise<VoiceKey[]> {
    const key = `prefs.pinnedVoice`;
    const item = await chrome.storage.sync.get({ [key]: [] });
    return item[key];
  }

  export function setPinnedVoices(voiceKeys: VoiceKey[]) {
    const key = `prefs.pinnedVoice`;
    const item = { [key]: voiceKeys };
    chrome.storage.sync.set(item).catch(console.error);
  }

  export async function getVoiceOptions(voiceKeys: VoiceKey[]): Promise<VoiceOptions> {
    const itemKeys = {} as { [key: string]: any };
    voiceKeys.forEach(key => itemKeys[key] = {});
    const items = await chrome.storage.sync.get(itemKeys);

    const voiceOptions = {} as VoiceOptions;
    voiceKeys.forEach(key => voiceOptions[key] = items[key]);
    return voiceOptions;
  }

  export async function setVoiceOption(voiceKey: VoiceKey, option: any) {
    chrome.storage.sync.set({ [voiceKey]: option }).catch(console.error);
  }
}
