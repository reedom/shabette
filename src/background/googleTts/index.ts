import { GoogleTtsInternal } from './api';
import { Gender, langCodeToLang, ProviderVoice, toVoiceKey, VoiceProviderId } from '../../models/voiceProviders';
import { GoogleVoiceOptions, VoicePreference } from '../../models/preference';
import { Memcache } from '../../utils/memcache';
import { playWaveRawData } from '../offscreen/audioPlayerClient';

export namespace GoogleTts {
  export async function listVoices(): Promise<ProviderVoice[] | string> {
    try {
      const voices = await listInternalVoicesWithCache();
      return voices.map(v => {
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
    } catch (err) {
      console.warn('Failed to list voices', err);
      return err instanceof Error ? err.message : `${err}`;
    }
  }

  export async function listInternalVoicesWithCache(): Promise<GoogleTtsInternal.Voice[]> {
    const cacheKey = `google.listVoices`;
    const cached = Memcache.get<GoogleTtsInternal.Voice[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('You need to set your Google API key first.');
    }

    const voices = await GoogleTtsInternal.listVoices({ apiKey: apiKey });
    voices.sort((a, b) => a.name.localeCompare(b.name));
    Memcache.set(cacheKey, voices);
    console.log('google voices', voices);
    return voices;
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
      await playWaveRawData(res);
    } catch (err) {
      console.warn('Failed to synthesize', err);
      return err instanceof Error ? err.message : `${err}`;
    }
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
}
