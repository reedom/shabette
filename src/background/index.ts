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
  const text = info.selectionText;
  if (!text) {
    return;
  }
  handleSynthesize(text).catch(console.error);
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

//   const {providerId, voiceId} = fromVoiceKey(selectedVoiceKey);
//   switch (providerId) {
//   case VoiceProviderId.google:
//     const googleVoices = await GoogleTts.listVoices();
//     if (typeof googleVoices === 'string') {
//       throw new Error(googleVoices);
//     }
//     return googleVoices.find(v => v.voiceId === voiceId) || googleVoices[0];
//
//   case VoiceProviderId.amazon:
//     const amazonVoices = await AmazonPolly.listVoices();
//     if (typeof amazonVoices === 'string') {
//       throw new Error(amazonVoices);
//     }
//     return amazonVoices.find(v => v. === voiceId) || googleVoices[0];
//   default:
//     throw Error('Unknown provider: ' + providerId);
//   }
//   if (providerId !== VoiceProviderId.google) {
//   }
//   const allVoices = await listVoices();
//     if (typeof allVoices === 'string') {
//       throw new Error(allVoices);
//     }
//     selectedVoice = allVoices.find(v => v.voiceId === 'google|en-US-Standard-A') || allVoices[0];
//   }
// }
