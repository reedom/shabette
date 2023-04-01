import React, { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { getSelectedLang, selectLang } from '../../models/backgroundMessages';

type Props = PropsWithChildren;

type State = {
  selectedLang: string | undefined,
  isLoading: boolean;
  selectLang: typeof selectLang,
}

const StateContext = createContext<State>({} as State);

export const SelectedLangProvider: FC<Props> = ({ children }) => {
  const [selectedLang, setSelectedLang] = useState<string>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getSelectedLang().then((lang) => {
      setSelectedLang(lang || 'en');
      setLoading(false);
    });
  }, []);

  const _selectLang = useCallback((lang: string) => {
    selectLang(lang);
    setSelectedLang(lang);
  }, []);

  return (
    <StateContext.Provider
      value={{
        selectedLang,
        isLoading,
        selectLang: _selectLang,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}
export const useSelectedLang = () => useContext(StateContext);
