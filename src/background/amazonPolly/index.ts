import { Voice } from '@aws-sdk/client-polly';
import { Gender, langCodeToLang, ProviderVoice, toVoiceKey, VoiceProviderId } from '../../models/voiceProviders';
import { Memcache } from '../../utils/memcache';
import { AmazonPollyInternal } from './api';
import { VoicePreference } from '../../models/preference';
import { playMP3, playWaveRawData } from '../offscreen/audioPlayerClient';
import { playPollyVoice } from '../offscreen/pollyPlayerClient';

export namespace AmazonPolly {
  export async function listVoices(): Promise<ProviderVoice[] | string> {
    try {
      const voices = await listInternalVoicesWithCache();
      return voices.map(v => {
        return {
          key: toVoiceKey(VoiceProviderId.amazon, v.Id!),
          providerId: VoiceProviderId.amazon,
          voiceId: v.Id!,
          lang: langCodeToLang(v.LanguageCode!),
          dialect: [v.LanguageCode!],
          gender: toExternalGender(v.Gender),
          engines: v.SupportedEngines!,
        }
      });
    } catch (err) {
      console.warn('Failed to list voices', err);
      return err instanceof Error ? err.message : `${err}`;
    }
  }

  export async function listInternalVoicesWithCache(): Promise<Voice[]> {
    const cacheKey = `amazon.listVoices`;
    const cached = Memcache.get<Voice[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const voices = await AmazonPollyInternal.listVoices();
    voices.sort((a, b) =>
      a.LanguageCode!.localeCompare(b.LanguageCode!) || a.Id!.localeCompare(b.Id!));
    console.log('amazon voices', voices);
    Memcache.set(cacheKey, voices);
    return voices;
  }

  export async function synthesize({ text, voice }: { text: string, voice: VoicePreference }) {
    try {
      const res = await AmazonPollyInternal.synthesize({
        text,
        dialect: voice.dialect![0],
        voiceId: voice.voiceId,
      });
      // await playPollyVoice({
      //   text,
      //   dialect: voice.dialect![0],
      //   voiceId: voice.voiceId,
      // });
      await playMP3(res);
    } catch (err) {
      console.warn('Failed to synthesize', err);
      return err instanceof Error ? err.message : `${err}`;
    }
  }

  function toInternalGender(gender: Gender | undefined): AmazonPollyInternal.Gender | undefined {
    switch (gender) {
    case 'male':
      return AmazonPollyInternal.Gender.Male;
    case 'female':
      return AmazonPollyInternal.Gender.Female;
    }
    return undefined;
  }

  function toExternalGender(gender: AmazonPollyInternal.Gender | string | undefined): Gender {
    switch (gender) {
    case AmazonPollyInternal.Gender.Male:
      return 'male';
    case AmazonPollyInternal.Gender.Female:
      return 'female';
    }
    return 'unknown';
  }
}
