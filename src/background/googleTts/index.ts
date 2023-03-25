import { Internal } from './api';
import { Gender, ProviderVoice, toVoiceKey } from '../../models/voiceProviders';
import { GoogleVoiceOptions, VoicePreference } from '../../models/preference';
import { Memcache } from '../../utils/memcache';

export async function listVoices(lang: string): Promise<ProviderVoice[] | string> {
  const cacheKey = `google.listVoices.${lang}`;
  const cached = Memcache.get<ProviderVoice[]>(cacheKey);
  if (cached) {
    return cached;
  }

  const res = await _listVoices(lang);
  if (typeof res === 'string') {
    return res;
  }

  res.sort((a, b) => a.voiceId.localeCompare(b.voiceId));
  Memcache.set(cacheKey, res);
  return res;
}

async function _listVoices(lang: string): Promise<ProviderVoice[] | string> {
  const apiKey = process.env.GOOGLE_API_KEY;
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
      gender: toExternalGender(v.ssmlGender),
    }
  });
}

export async function synthesize({ text, voice }: { text: string, voice: VoicePreference }) {
  const apiKey = process.env.GOOGLE_API_KEY;
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
    url: chrome.runtime.getURL('googlePlayer.html'),
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

function toExternalGender(gender: Internal.Gender): Gender {
  switch (gender) {
  case 'MALE':
    return 'male';
  case 'FEMALE':
    return 'female';
  }
  return 'unknown';
}
