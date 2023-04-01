import React, { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { getSelectedVoice, selectVoice } from '../../models/backgroundMessages';
import { ProviderVoice } from '../../models/voiceProviders';

type Props = PropsWithChildren;

type State = {
  selectedVoice: ProviderVoice | undefined,
  isLoading: boolean;
  selectVoice: typeof selectVoice,
}

const StateContext = createContext<State>({} as State);

export const SelectedVoiceProvider: FC<Props> = ({ children }) => {
  const [selectedVoice, setSelectedVoice] = useState<ProviderVoice | undefined>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getSelectedVoice().then((params) => {
      setSelectedVoice(params);
      setLoading(false);
    });
  }, []);

  const _selectVoice = useCallback((voice: ProviderVoice) => {
    selectVoice(voice);
    setSelectedVoice(voice);
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
