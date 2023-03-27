import { fromByteArray } from 'base64-js';

export async function playWaveRawData(rawDataString: string) {
  await createOffscreen();
  const source = rawDataString
  await chrome.runtime.sendMessage({ type: 'playWaveRawData', source, volume: 1 });
}

export async function playMP3(data: Uint8Array) {
  await createOffscreen();
  const source = fromByteArray(data);
  await chrome.runtime.sendMessage({ type: 'playMP3', source, volume: 1 });
}

// Create the offscreen document if it doesn't already exist
export async function createOffscreen() {
  // @ts-ignore
  if (await chrome.offscreen.hasDocument()) return;
  // @ts-ignore
  await chrome.offscreen.createDocument({
    url: chrome.runtime.getURL('audioPlayer.html'),
    reasons: ['AUDIO_PLAYBACK'],
    justification: 'testing' // details for using the API
  });
}
