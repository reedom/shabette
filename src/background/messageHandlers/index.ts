import MessageSender = chrome.runtime.MessageSender;
import { listProviders } from './providers';
import { AppStorage } from '../storage';
import { listVoices as googleTtsListVoices } from '../googleTts';
import { listVoices as amazonTtsListVoices } from '../amazonPolly';
import { BackgroundMessage } from '../../models/backgroundMessages';
import { fromVoiceKey, toVoiceKey, VoiceProviderId } from '../../models/voiceProviders';

export function messageHandler<M extends BackgroundMessage>(msg: M, sender: MessageSender, sendResponse: (response?: any) => void) {
  switch (msg.type) {
  case 'listProviders':
    sendResponse(listProviders());
    return;

  case 'listVoices':
    switch (msg.providerId) {
    case VoiceProviderId.google:
      googleTtsListVoices()
        .then(sendResponse)
        .catch(err => sendResponse(err.message));
      return true;
    case VoiceProviderId.amazon:
      amazonTtsListVoices()
        .then(sendResponse)
        .catch(err => sendResponse(err.message));
      return true;
    }
    return;

  case 'ui.selectVoiceProvider':
    AppStorage.setSelectedVoiceProvider(msg.providerId);
    return;

  case 'ui.selectedVoiceProvider':
    AppStorage.getSelectedVoiceProvider()
      .then(providerId => {
        sendResponse(providerId || VoiceProviderId.google);
      });
    return true;

  case 'preference.selectVoice':
    AppStorage.setSelectedVoice(toVoiceKey(msg.providerId, msg.voiceId));
    return;

  case 'preference.selectedVoice':
    AppStorage.getSelectedVoice()
      .then(voiceKey => {
        sendResponse(voiceKey ? { key: voiceKey, ...fromVoiceKey(voiceKey) } : undefined);
      })
      .catch(err => sendResponse(err.message));
    return true;

  case 'preference.pinVoice':
    AppStorage.getPinnedVoices()
      .then(pinnedVoices => {
        const voiceKey = toVoiceKey(msg.providerId, msg.voiceId);
        const newVoices = pinnedVoices.filter(v => v !== voiceKey);
        if (msg.pin) {
          newVoices.unshift(voiceKey);
        }
        AppStorage.setPinnedVoices(newVoices);
      })
      .catch(err => sendResponse(err.message));
    return true;

  case 'preference.pinnedVoices':
    AppStorage.getPinnedVoices()
      .then(pinnedVoices => sendResponse(
        pinnedVoices.map(voiceKey => ({ key: voiceKey, ...fromVoiceKey(voiceKey) }))
      ))
      .catch(err => sendResponse(err.message));
    return true;
  }
}
