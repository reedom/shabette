import { VoiceKey } from '../models/voiceProviders';

export namespace AppStorage {
  export interface VoiceOptions {
    [key: VoiceKey]: any;
  }

  export async function getSelectedVoice(lang: string): Promise<VoiceKey | null> {
    const key = `prefs.selectedVoice.${lang}`;
    const item = await chrome.storage.sync.get({ [key]: null });
    return item[key];
  }

  export function setSelectedVoice(lang: string, voiceKey: VoiceKey) {
    const key = `prefs.selectedVoice.${lang}`;
    const item = { [key]: voiceKey };
    chrome.storage.sync.set({ item }).catch(console.error);
  }

  export async function getPinnedVoices(lang: string): Promise<VoiceKey[]> {
    const key = `prefs.pinnedVoice.${lang}`;
    const item = await chrome.storage.sync.get({ [key]: [] });
    return item[key];
  }

  export function setPinnedVoices(lang: string, voiceKeys: VoiceKey[]) {
    const key = `prefs.pinnedVoice.${lang}`;
    const item = { [key]: voiceKeys };
    chrome.storage.sync.set({ item }).catch(console.error);
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
