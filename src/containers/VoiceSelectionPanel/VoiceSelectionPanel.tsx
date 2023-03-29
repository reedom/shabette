import React from 'react';
import { PinnedLangsProvider, usePinnedLangs } from '../../hooks/usePinnedLangs';
import { SelectedLangProvider } from '../../hooks/useSelectedLang';
import { useVoiceProviders } from '../../hooks/useVoiceProviders';
import { useAvailableVoices } from '../../hooks/useAvailableVoices';
import { useSelectedVoice } from '../../hooks/useSelectedVoice';
import { usePinnedVoices } from '../../hooks/usePinnedVoices';
import LangsPanel from '../LangsPanel';
import SelectableList from '../SelectableList';
import { ProviderVoice, VoiceProvider } from '../../models/voiceProviders';
import VoiceItem from '../VoiceItem';

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
  const { pinnedLangs, pinLang, isLoading: isLoadingPinnedLangs } = usePinnedLangs();
  const { voiceProviders, selectedVoiceProvider, selectVoiceProvider, isLoading: isLoadingVoiceProviders } =
    useVoiceProviders();
  const { availableVoices } = useAvailableVoices();
  const { selectVoice, selectedVoice, isLoading: isLoadingSelectedVoice } = useSelectedVoice();
  const { pinnedVoices, pinVoice, isLoading: isLoadingPinnedVoices } = usePinnedVoices();

  if (isLoadingPinnedLangs || isLoadingVoiceProviders || isLoadingSelectedVoice || isLoadingPinnedVoices ||
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
      {availableVoices[selectedVoiceProvider.id].map((voice: ProviderVoice) => (
        <VoiceItem
          {...voice}
          selected={voice.voiceId === selectedVoice?.voiceId && voice.providerId === selectedVoice?.providerId}
          onSelected={() => selectVoice(voice)}
        />
      ))}
    </div>
  );
}
