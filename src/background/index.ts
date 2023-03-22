import { messageHandler } from './messageHandlers';
import { AppStorage } from './storage';
import { synthesize } from './googleTts';

chrome.runtime.onMessage.addListener(messageHandler);

chrome.contextMenus.create({
  id: 'shabette-read-this',
  title: "Shabette selection",
  contexts: ["selection"],
  type: "normal",
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const text = info.selectionText;
  if (text) {
    synthesize({
      text,
      voice: {
        providerId: 'google',
        lang: 'en',
        voiceId: 'en-US-Standard-A',
        key: 'google|en-US-Standard-A',
        dialect: 'en-US',
      }
    });
  }
});
