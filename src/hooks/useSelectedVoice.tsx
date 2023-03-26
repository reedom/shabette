import React, { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { getSelectedVoice, selectVoice } from '../models/backgroundMessages';
import { toVoiceKey, VoiceKey, VoiceProviderId } from '../models/voiceProviders';

type Props = PropsWithChildren;

type State = {
  selectedVoice: { voiceKey: VoiceKey, providerId: VoiceProviderId, voiceId: string } | undefined,
  isLoading: boolean;
  selectVoice: typeof selectVoice,
}

const StateContext = createContext<State>({} as State);

export const SelectedVoiceProvider: FC<Props> = ({ children }) => {
  const [selectedVoice, setSelectedVoice] = useState<{ voiceKey: VoiceKey, providerId: VoiceProviderId, voiceId: string } | undefined>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getSelectedVoice().then((params) => {
      setSelectedVoice(params);
      setLoading(false);
    });
  }, []);

  const _selectVoice = useCallback((args: { providerId: VoiceProviderId, voiceId: string }) => {
    selectVoice(args);
    const voiceKey = toVoiceKey(args.providerId, args.voiceId);
    setSelectedVoice({ voiceKey, ...args });
  }, []);

  return (
    <StateContext.Provider
      value={{
        selectedVoice,
        isLoading,
        selectVoice: _selectVoice,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}
export const useSelectedVoice = () => useContext(StateContext);
