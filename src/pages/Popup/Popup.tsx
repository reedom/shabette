import React from 'react';
import { ProviderVoice, VoiceProvider } from '../../models/voiceProviders';
import SelectableList from '../../containers/SelectableList/SelectableList';
import { useVoiceProviders } from '../../hooks/useVoiceProviders';
import { useAvailableVoices } from '../../hooks/useAvailableVoices';
import { usePinnedVoices } from '../../hooks/usePinnedVoices';
import { useSelectedVoice } from '../../hooks/useSelectedVoice';
import VoiceItem from '../../containers/VoiceItem';

const Popup = () => {
  const { voiceProviders, selectedVoiceProvider, selectVoiceProvider, isLoading: isVoiceProvidersLoading } =
    useVoiceProviders();
  const { availableVoices } = useAvailableVoices();
  const { selectVoice, selectedVoice, isLoading: isLoadingSelectedVoice } = useSelectedVoice();
  const { pinnedVoices, pinVoice, isLoading: isLoadingPinnedVoices } = usePinnedVoices();

  if (isVoiceProvidersLoading || isLoadingSelectedVoice || isLoadingPinnedVoices ||
    !selectedVoiceProvider || !availableVoices[selectedVoiceProvider?.id]) {
    return <div>Loading...</div>;
  }

  return (
    <div>
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
};

export default Popup;
