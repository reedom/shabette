import { VoiceKey } from '../models/voiceProviders';

export namespace AppStorage {
  export interface SelectedVoices {
    [lang: string]: VoiceKey;
  }

  export interface VoiceOptions {
    [key: VoiceKey]: any;
  }

  export async function getApiKey(service: string): Promise<string | null> {
    const key = `apiKey.${service}`;
    const item = await chrome.storage.sync.get({ [key]: null });
    return item[key] || null;
  }

  export function setApiKey(service: string, apiKey: string) {
    const key = `apiKey.${service}`;
    chrome.storage.sync.set({ [key]: apiKey }).catch(console.error);
  }

  export async function getSelectedVoices(): Promise<SelectedVoices> {
    const item = await chrome.storage.sync.get({ selectedVoices: {} });
    return item.selectedVoices;
  }

  export function setSelectedVoices(selectedVoices: SelectedVoices) {
    chrome.storage.sync.set({ selectedVoices }).catch(console.error);
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
    chrome.storage.sync.set({[voiceKey]: option}).catch(console.error);
  }
}
