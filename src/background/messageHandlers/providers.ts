import { VoiceProvider, VoiceProviderId } from '../../models/voiceProviders';

export function listProviders(): VoiceProvider[] {
  return [{ id: VoiceProviderId.google, name: 'Google' }];
}
