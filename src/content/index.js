import { messageHandler } from './messageHandlers';

console.log('Content script loaded');
chrome.runtime.onMessage.addListener(messageHandler);
