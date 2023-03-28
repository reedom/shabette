import MessageSender = chrome.runtime.MessageSender;
import { listProviders } from './providers';
import { AppStorage } from '../storage';
import { GoogleTts } from '../googleTts';
import { AmazonPolly } from '../amazonPolly';
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
      GoogleTts.listVoices()
        .then(sendResponse)
        .catch(err => sendResponse(err.message));
      return true;
    case VoiceProviderId.amazon:
      AmazonPolly.listVoices()
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
    AppStorage.setSelectedVoice(msg.voice);
    return;

  case 'preference.selectedVoice':
    AppStorage.getSelectedVoice()
      .then(voice => {
        sendResponse(voice || undefined);
      })
      .catch(err => sendResponse(err.message));
    return true;

  case 'preference.pinLang':
    AppStorage.getPinnedLangs()
      .then(pinnedLangs => {
        const newLangs = pinnedLangs.filter(v => v !== msg.lang);
        if (msg.pin) {
          newLangs.unshift(msg.lang);
          newLangs.sort();
        }
        AppStorage.setPinnedLangs(newLangs);
      })
      .catch(err => sendResponse(err.message));
    return true;

  case 'preference.pinnedLangs':
    AppStorage.getPinnedLangs()
      .then(sendResponse)
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
        pinnedVoices.map(voiceKey => ({ voiceKey, ...fromVoiceKey(voiceKey) }))
      ))
      .catch(err => sendResponse(err.message));
    return true;
  }
}
