import React, { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { getPinnedLangs, pinLang } from '../models/backgroundMessages';

type Props = PropsWithChildren;

type State = {
  pinnedLangs: string[] | undefined,
  isLoading: boolean;
  pinLang: typeof pinLang,
}

const StateContext = createContext<State>({} as State);

export const PinnedLangsProvider: FC<Props> = ({ children }) => {
  const [pinnedLangs, setPinnedLangs] = useState<string[]>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getPinnedLangs().then((params) => {
      setPinnedLangs(params);
      setLoading(false);
    });
  }, []);

  const _pinLang = useCallback((args: { lang: string, pin: boolean }) => {
    pinLang(args);
    setPinnedLangs(prev => {
      if (!prev) return prev;
      return args.pin
        ? [args.lang, ...prev].sort()
        : prev.filter(v => v !== args.lang);
    });
  }, []);

  return (
    <StateContext.Provider
      value={{
        pinnedLangs,
        isLoading,
        pinLang: _pinLang,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}
export const usePinnedLangs = () => useContext(StateContext);
