import { atom, DefaultValue, selector } from 'recoil';
import { VoiceKey, VoiceProviderId } from '../models/voiceProviders';
import {
  getPinnedVoices,
  getSelectedVoice,
  getSelectedVoiceProvider,
  selectVoiceProvider
} from '../models/backgroundMessages';

export const selectedVoiceProviderRequestId = atom({
  key: 'selectedVoiceProviderRequestId',
  default: 0,
});

export const selectedVoiceProviderState = selector<VoiceProviderId>({
  key: 'selectedVoiceProvider',
  get: async ({ get }) => {
    get(selectedVoiceProviderRequestId);
    return getSelectedVoiceProvider();
  },
  set: ({ set }, providerId) => {
    if (!(providerId instanceof DefaultValue)) {
      selectVoiceProvider({ providerId });
      set(selectedVoiceProviderRequestId, (id) => id + 1);
    }
  },
});

// export function selectVoiceProvider(providerId: VoiceProviderId) {
//   const [] = useAtomState
//   return async () => {
//     await selectVoiceProvider({ providerId });
//   };
// }
export const selectedVoiceState = selector<{ key: VoiceKey, providerId: VoiceProviderId, voiceId: string } | undefined>({
  key: 'selectedVoice',
  get: async () => getSelectedVoice(),
});

export const pinnedVoicesState = selector<{ key: VoiceKey, providerId: VoiceProviderId, voiceId: string }[]>({
  key: 'pinnedVoices',
  get: async () => getPinnedVoices(),
});

