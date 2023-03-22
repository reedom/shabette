import { VoiceProvider } from '../../models/voiceProviders';

export function listProviders(): VoiceProvider[] {
  return [{ id: 'google', name: 'Google' }];
}
