import MessageSender = chrome.runtime.MessageSender;
import { listProviders } from './providers';
import { AppStorage } from '../storage';
import { listVoices as googleTtsListVoices } from '../googleTts';
import { listVoices as amazonTtsListVoices } from '../amazonPolly';
import { BackgroundMessage } from '../../models/messages';
import { fromVoiceKey, toVoiceKey, VoiceProviderId } from '../../models/voiceProviders';

export function messageHandler<M extends BackgroundMessage>(msg: M, sender: MessageSender, sendResponse: (response?: any) => void) {
  switch (msg.type) {
  case 'listProviders':
    sendResponse(listProviders());
    return;

  case 'listVoices':
    switch (msg.providerId) {
    case VoiceProviderId.google:
      googleTtsListVoices(msg.lang)
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

  case 'preference.selectVoice':
    AppStorage.setSelectedVoice(msg.lang, toVoiceKey(msg.providerId, msg.voiceId));
    return;

  case 'preference.selectedVoice':
    AppStorage.getSelectedVoice(msg.lang)
      .then(voiceKey => {
        sendResponse(voiceKey ? fromVoiceKey(voiceKey) : undefined);
      })
      .catch(err => sendResponse(err.message));
    return true;

  case 'preference.pinVoice':
    AppStorage.getPinnedVoices(msg.lang)
      .then(pinnedVoices => {
        const voiceKey = toVoiceKey(msg.providerId, msg.voiceId);
        const newVoices = pinnedVoices.filter(v => v !== voiceKey);
        if (msg.pin) {
          newVoices.push(voiceKey);
        }
        AppStorage.setPinnedVoices(msg.lang, newVoices);
      })
      .catch(err => sendResponse(err.message));
    return true;

  case 'preference.pinnedVoices':
    AppStorage.getPinnedVoices(msg.lang)
      .then(pinnedVoices => sendResponse(pinnedVoices.map(fromVoiceKey)))
      .catch(err => sendResponse(err.message));
    return true;
  }
}
