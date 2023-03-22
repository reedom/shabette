import MessageSender = chrome.runtime.MessageSender;
import { listProviders } from './providers';
import { BackgroundMessage } from '../../../models/messages';
import { listVoices as googleTtsListVoices } from '../googleTts';

export function messageHandler(msg: BackgroundMessage, sender: MessageSender, sendResponse: (response?: any) => void) {
  switch (msg.type) {
  case 'listProviders':
    sendResponse(listProviders());
    return;
  case 'listVoices':
    switch (msg.providerId) {
    case 'google':
      googleTtsListVoices(msg.lang)
        .then(sendResponse);
      return true;
    }
    return;
  }
}
