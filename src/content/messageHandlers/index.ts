import MessageSender = chrome.runtime.MessageSender;
import { parseForReader } from './parseForReader';
import { ContentMessage } from '../../models/contentMessages';
import { startTextSelectionMode, stopTextSelectionMode } from './selectionMode';

export function messageHandler<M extends ContentMessage>(msg: M, sender: MessageSender, sendResponse: (response?: any) => void) {
  console.log('messageHandler', msg);
  switch (msg.type) {
  case 'parseForReader':
    parseForReader()
      .then(sendResponse)
      .catch(console.error)
    return true;

  case 'ui.startTextSelectionMode':
    startTextSelectionMode();
    return;

  case 'ui.stopTextSelectionMode':
    stopTextSelectionMode();
    return;
  }
}
