import React, { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import useSWR from 'swr'
import { getSelectedVoiceProvider, listVoiceProviders, selectVoiceProvider } from '../models/backgroundMessages';
import { VoiceProvider, VoiceProviderId } from '../models/voiceProviders';

type Props = PropsWithChildren;

type State = {
  selectedVoiceProvider: VoiceProvider | undefined,
  voiceProviders: VoiceProvider[] | undefined,
  isLoading: boolean;
  selectVoiceProvider: (id: VoiceProviderId) => void,
}

const StateContext = createContext<State>({} as State);

export const VoiceProvidersProvider: FC<Props> = ({ children }) => {
  const { data: voiceProviders } = useSWR('listVoiceProviders', listVoiceProviders);
  const { data: initialVoiceProviderId } = useSWR('selectedVoiceProvider', getSelectedVoiceProvider);
  const [selectedVoiceProvider, setSelectedVoiceProvider] = useState<VoiceProvider>();

  const updateSelectedVoiceProvider = useCallback(
    (providerId: VoiceProviderId) => {
      const provider = voiceProviders?.find(provider => provider.id === providerId);
      if (provider) {
        setSelectedVoiceProvider(provider);
      }
    }, [voiceProviders]);

  useEffect(() => {
    if (initialVoiceProviderId && voiceProviders) {
      updateSelectedVoiceProvider(initialVoiceProviderId);
    }
  }, [updateSelectedVoiceProvider, initialVoiceProviderId, voiceProviders]);

  const _selectVoiceProvider = useCallback(
    (providerId: VoiceProviderId) => {
      console.log('select', providerId);
      selectVoiceProvider({ providerId });
      updateSelectedVoiceProvider(providerId);
    }, [updateSelectedVoiceProvider]);

  return (
    <StateContext.Provider
      value={{
        voiceProviders,
        selectedVoiceProvider,
        isLoading: !selectedVoiceProvider || !voiceProviders,
        selectVoiceProvider: _selectVoiceProvider,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}
export const useVoiceProviders = () => useContext(StateContext);
