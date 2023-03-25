import { GoogleTtsInternal } from './api';
import { Gender, langCodeToLang, ProviderVoice, toVoiceKey, VoiceProviderId } from '../../models/voiceProviders';
import { GoogleVoiceOptions, VoicePreference } from '../../models/preference';
import { Memcache } from '../../utils/memcache';

export async function listVoices(lang: string): Promise<ProviderVoice[] | string> {
  const cacheKey = `google.listVoices.${lang}`;
  const cached = Memcache.get<ProviderVoice[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const res = await _listVoices();
    if (typeof res === 'string') {
      return res;
    }

    res.sort((a, b) => a.voiceId.localeCompare(b.voiceId));
    Memcache.set(cacheKey, res);
    return res;
  } catch (err) {
    console.warn('Failed to list voices', err);
    return err instanceof Error ? err.message : `${err}`;
  }
}

async function _listVoices(): Promise<ProviderVoice[] | string> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return 'You need to set your Google API key first.';
  }

  const res = await GoogleTtsInternal.listVoices({ apiKey: apiKey });
  console.log('google voices', res);
  return res.map(v => {
    return {
      key: toVoiceKey(VoiceProviderId.google, v.name),
      providerId: VoiceProviderId.google,
      voiceId: v.name,
      lang: langCodeToLang(v.languageCodes[0]),
      dialect: v.languageCodes,
      gender: toExternalGender(v.ssmlGender),
      engines: [extractEngine(v.name)],
    }
  });
}

export async function synthesize({ text, voice }: { text: string, voice: VoicePreference }) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return 'You need to set your Google API key first.';
  }

  try {
    const options: GoogleVoiceOptions | undefined = voice.voiceOptions;
    const res = await GoogleTtsInternal.synthesize({
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
    await playVoice(res);
  } catch (err) {
    console.warn('Failed to synthesize', err);
    return err instanceof Error ? err.message : `${err}`;
  }
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

function toInternalGender(gender: Gender | undefined): GoogleTtsInternal.Gender | undefined {
  switch (gender) {
  case 'male':
    return 'MALE';
  case 'female':
    return 'FEMALE';
  }
  return undefined;
}

function toExternalGender(gender: GoogleTtsInternal.Gender): Gender {
  switch (gender) {
  case 'MALE':
    return 'male';
  case 'FEMALE':
    return 'female';
  }
  return 'unknown';
}

function extractEngine(voiceName: string) {
  const m = voiceName.split('-');
  if (m.length < 3) {
    return 'standard';
  }
  return m[2].toLowerCase();
}
