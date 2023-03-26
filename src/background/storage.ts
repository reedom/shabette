import { VoiceKey } from '../models/voiceProviders';

export namespace AppStorage {
  export interface VoiceOptions {
    [key: VoiceKey]: any;
  }

  export async function getSelectedVoice(): Promise<VoiceKey | null> {
    const key = `prefs.selectedVoice`;
    const item = await chrome.storage.sync.get({ [key]: null });
    return item[key];
  }

  export function setSelectedVoice(voiceKey: VoiceKey) {
    const key = `prefs.selectedVoice`;
    const item = { [key]: voiceKey };
    chrome.storage.sync.set({ item }).catch(console.error);
  }

  export async function getPinnedVoices(): Promise<VoiceKey[]> {
    const key = `prefs.pinnedVoice`;
    const item = await chrome.storage.sync.get({ [key]: [] });
    return item[key];
  }

  export function setPinnedVoices(voiceKeys: VoiceKey[]) {
    const key = `prefs.pinnedVoice`;
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
