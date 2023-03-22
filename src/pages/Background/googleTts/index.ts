import { Internal } from './api';
import { AppStorage } from '../storage';
import { Gender, ProviderVoice, toVoiceKey } from '../../../models/voiceProviders';
import { GoogleVoiceOptions, VoicePreference } from '../../../models/preference';

export async function listVoices(lang: string): Promise<ProviderVoice[] | string> {
  const apiKey = await AppStorage.getApiKey('google');
  if (!apiKey) {
    return 'You need to set your Google API key first.';
  }

  const res = await Internal.listVoices({ apiKey: apiKey, lang: lang });
  if (res instanceof Error) {
    return res.message;
  }

  return res.map(v => {
    return {
      key: toVoiceKey('google', v.name),
      providerId: 'google',
      voiceId: v.name,
      lang,
      dialect: v.languageCodes,
    }
  });
}

export async function synthesize({ text, voice }: { text: string, voice: VoicePreference }) {
  const apiKey = await AppStorage.getApiKey('google');
  if (!apiKey) {
    return 'You need to set your Google API key first.';
  }

  const options: GoogleVoiceOptions | undefined = voice.voiceOptions;
  const res = await Internal.synthesize({
    apiKey,
    text,
    lang: voice.lang,
    voice: voice.voiceId,
    options: {
      pitch: options?.pitch,
      volume: options?.volume,
      speed: options?.speed,
      gender: toInternalGender(options?.gender),
    },
  });

  if (res instanceof Error) {
    return res.message;
  }
  await playVoice(res);
}

async function playVoice(audio_string: string) {
  await createOffscreen();
  const source = "data:audio/wav;base64," + audio_string
  await chrome.runtime.sendMessage({ play: { source, volume: 1 } });
}

// Create the offscreen document if it doesn't already exist
async function createOffscreen() {
  // @ts-ignore
  if (await chrome.offscreen.hasDocument()) return;
  // @ts-ignore
  await chrome.offscreen.createDocument({
    url: chrome.runtime.getURL('google_player.html'),
    reasons: ['AUDIO_PLAYBACK'],
    justification: 'testing' // details for using the API
  });
}

function toInternalGender(gender: Gender | undefined): Internal.Gender | undefined {
  switch (gender) {
  case 'male':
    return 'MALE';
  case 'female':
    return 'FEMALE';
  }
  return undefined;
}
