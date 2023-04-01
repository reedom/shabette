import MessageSender = chrome.runtime.MessageSender;
import { parseForReader } from './parseForReader';
import { ContentMessage } from '../../models/contentMessages';

export function messageHandler<M extends ContentMessage>(msg: M, sender: MessageSender, sendResponse: (response?: any) => void) {
  console.log('messageHandler', msg);
  switch (msg.type) {
  case 'parseForReader':
    parseForReader()
      .then(sendResponse)
      .catch(console.error)
    return true;
  }
}
