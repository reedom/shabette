import { messageHandler } from './messageHandlers';

chrome.runtime.onMessage.addListener(messageHandler);
