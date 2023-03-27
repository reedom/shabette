import { VoiceProviderId } from '../../models/voiceProviders';
import { toByteArray } from 'base64-js';

chrome.runtime.onMessage.addListener(msg => {
  switch (msg.type) {
  case 'playWaveRawData':
    return playWaveRawData(msg);
  case 'playMP3':
    return playMP3(msg);
  }
});

// Play sound with access to DOM APIs
function playWaveRawData({ source, volume }: { source: string, volume: number, voiceProviderId: VoiceProviderId }) {
  const audio = new Audio("data:audio/wav;base64," + source);
  // audio.volume = volume;
  audio.play().catch(console.error)
}

function playMP3({ source, volume }: { source: string, volume: number, voiceProviderId: VoiceProviderId }) {
  const sourceData = toByteArray(source);
  const blob = new Blob([sourceData.buffer], { type: 'audio/mp3' });
  const audio = new Audio(URL.createObjectURL(blob));
  audio.play().catch(console.error)
}
