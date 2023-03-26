import React, { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { getPinnedVoices, pinVoice } from '../models/backgroundMessages';
import { toVoiceKey, VoiceKey, VoiceProviderId } from '../models/voiceProviders';

type Props = PropsWithChildren;

type State = {
  pinnedVoices: { voiceKey: VoiceKey, providerId: VoiceProviderId, voiceId: string }[] | undefined,
  isLoading: boolean;
  pinVoice: typeof pinVoice,
}

const StateContext = createContext<State>({} as State);

export const PinnedVoicesProvider: FC<Props> = ({ children }) => {
  const [pinnedVoices, setPinnedVoices] = useState<{ voiceKey: VoiceKey, providerId: VoiceProviderId, voiceId: string }[]>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getPinnedVoices().then((params) => {
      setPinnedVoices(params);
      setLoading(false);
    });
  }, []);

  const _pinVoice = useCallback((args: { lang: string, providerId: VoiceProviderId, voiceId: string, pin: boolean }) => {
    pinVoice(args);
    const voiceKey = toVoiceKey(args.providerId, args.voiceId);
    setPinnedVoices(prev => {
      if (!prev) return prev;
      return args.pin
        ? [{ voiceKey, ...args }, ...prev]
        : prev.filter(v => v.voiceKey !== voiceKey);
    });
  }, []);

  return (
    <StateContext.Provider
      value={{
        pinnedVoices,
        isLoading,
        pinVoice: _pinVoice,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}
export const usePinnedVoices = () => useContext(StateContext);
