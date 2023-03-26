import { Gender, langCodeToLang, ProviderVoice, toVoiceKey, VoiceProviderId } from '../../models/voiceProviders';
import { Memcache } from '../../utils/memcache';
import { AmazonPollyInternal } from './api';

export async function listVoices(): Promise<ProviderVoice[] | string> {
  const cacheKey = `amazon.listVoices`;
  const cached = Memcache.get<ProviderVoice[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const res = await _listVoices();
    if (typeof res === 'string') {
      return res;
    }

    res.sort((a, b) =>
      a.lang.localeCompare(b.lang) || a.voiceId.localeCompare(b.voiceId));
    Memcache.set(cacheKey, res);
    return res;
  } catch (err) {
    console.warn('Failed to list voices', err);
    return err instanceof Error ? err.message : `${err}`;
  }
}

async function _listVoices(): Promise<ProviderVoice[] | string> {
  const res = await AmazonPollyInternal.listVoices();
  console.log('amazon voices', res);
  return res.map(v => {
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
