import { Gender, ProviderVoice } from './voiceProviders';

export interface VoicePreference extends ProviderVoice {
  // provider specific voice options.
  voiceOptions?: any;
}

export interface GoogleVoiceOptions {
  speed?: number;
  pitch?: number;
  gender?: Gender;
  volume?: number;
}

export interface PinnedLanguages {
  pinned: string[];
  selected: string;
}

export interface LanguagePreference {
  // language code. E.g. en, ja, etc.
  lang: string;
  // speed. E.g. 1.0, 1.5, etc.
  speed: number;
}
