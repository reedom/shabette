import { messageHandler } from './messageHandlers';
import { GoogleTts } from './googleTts';
import { AmazonPolly } from './amazonPolly';
import { ProviderVoice, VoiceProviderId } from '../models/voiceProviders';
import { AppStorage } from './storage';

chrome.runtime.onMessage.addListener(messageHandler);

chrome.contextMenus.create({
  id: 'shabette-read-this',
  title: "Shabette selection",
  contexts: ["selection"],
  type: "normal",
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.tabs.sendMessage(tab!.id!, { type: 'parseForReader' }, (res) => {
    console.log(res);
  });
  return;

  const text = info.selectionText;
  if (!text) {
    return;
  }
  // handleSynthesize(text).catch(console.error);
});

export async function handleSynthesize(text: string) {
  const voice = await getVoiceForSynthesis();
  switch (voice.providerId) {
  case VoiceProviderId.google:
    return GoogleTts.synthesize({ text, voice });
  case VoiceProviderId.amazon:
    return AmazonPolly.synthesize({ text, voice });
  default:
    throw Error('Unknown provider: ' + voice.providerId);
  }
}

async function getVoiceForSynthesis(): Promise<ProviderVoice> {
  let selectedVoice = await AppStorage.getSelectedVoice();
  if (selectedVoice) {
    return selectedVoice;
  }
  const voices = await GoogleTts.listVoices()
  if (typeof voices === 'string') {
    throw new Error(voices);
  }
  return voices.find(v => v.voiceId === 'en-US-Standard-A') || voices[0];
}
