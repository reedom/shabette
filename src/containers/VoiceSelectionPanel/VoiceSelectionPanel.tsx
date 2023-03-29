import React from 'react';
import { PinnedLangsProvider, usePinnedLangs } from '../../hooks/usePinnedLangs';
import { SelectedLangProvider, useSelectedLang } from '../../hooks/useSelectedLang';
import { useVoiceProviders } from '../../hooks/useVoiceProviders';
import { useAvailableVoices } from '../../hooks/useAvailableVoices';
import { useSelectedVoice } from '../../hooks/useSelectedVoice';
import { usePinnedVoices } from '../../hooks/usePinnedVoices';
import LangsPanel from '../LangsPanel';
import SelectableList from '../SelectableList';
import { VoiceProvider } from '../../models/voiceProviders';
import SelectableVoiceList from './SelectableVoiceList';

type Props = {}

export type SelectableListItem = {
  label: string;
  value: string;
  onClick: () => void;
}

export default function VoiceSelectionPanel(props: Props) {
  return (
    <SelectedLangProvider>
      <PinnedLangsProvider>
        <Content {...props}/>
      </PinnedLangsProvider>
    </SelectedLangProvider>
  )
}

function Content(props: Props) {
  const { selectedLang, selectLang, isLoading: isLoadingLang } = useSelectedLang();
  const { pinnedLangs, pinLang, isLoading: isLoadingPinnedLangs } = usePinnedLangs();
  const { voiceProviders, selectedVoiceProvider, selectVoiceProvider, isLoading: isLoadingVoiceProviders } =
    useVoiceProviders();
  const { availableVoices } = useAvailableVoices();
  const { selectVoice, selectedVoice, isLoading: isLoadingSelectedVoice } = useSelectedVoice();
  const { pinnedVoices, pinVoice, isLoading: isLoadingPinnedVoices } = usePinnedVoices();

  if (isLoadingLang || isLoadingPinnedLangs || isLoadingVoiceProviders || isLoadingSelectedVoice || isLoadingPinnedVoices ||
    !selectedVoiceProvider || !availableVoices[selectedVoiceProvider?.id]) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <LangsPanel/>
      <SelectableList
        items={voiceProviders!.map((provider: VoiceProvider) => ({
          label: provider.name,
          value: provider.id,
          onClick: () => selectVoiceProvider(provider.id),
        }))}
        selected={selectedVoiceProvider!.id}/>
      <SelectableVoiceList
        lang={selectedLang!}
        voices={availableVoices[selectedVoiceProvider!.id]}
        selectedVoice={selectedVoice}
        selectVoice={selectVoice}
      />
    </div>
  );
}
