import React from 'react';
import * as styles from './LangsPanel.css';
import { usePinnedLangs } from '../../hooks/usePinnedLangs';
import useSWR from 'swr';
import { listLangs } from '../../models/backgroundMessages';
import Chip from '../Chip';
import { useSelectedLang } from '../../hooks/useSelectedLang';

type Props = {}

export type SelectableListItem = {
  label: string;
  value: string;
  onClick: () => void;
}

export default function LangsPanel(props: Props) {
  const { data: langs, ...langsState } = useSWR<string[]>('langs', listLangs);
  const { selectedLang, selectLang, isLoading: isLoadingSelectedLang } = useSelectedLang();
  const { pinnedLangs, pinLang, isLoading: isLoadingPinnedLangs } = usePinnedLangs();

  console.log({ langs, pinnedLangs, selectedLang });

  const isLoading = isLoadingSelectedLang || langsState.isLoading || isLoadingPinnedLangs;

  return isLoading
    ? <div className={styles.container}/>
    : <div className={styles.container}>
      {pinnedLangs!.map(lang => (
        <Chip
          label={lang}
          color={lang === selectedLang ? 'primary' : 'default'} key={lang}
          onClick={() => selectLang(lang)}
        />
      ))}
    </div>
}
