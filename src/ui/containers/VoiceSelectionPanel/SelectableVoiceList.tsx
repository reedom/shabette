import React from 'react';
import { ProviderVoice } from '../../../models/voiceProviders';
import VoiceItem from '../VoiceItem';

type Props = {
  lang: string;
  voices: ProviderVoice[];
  selectedVoice: ProviderVoice | undefined;
  selectVoice: (voice: ProviderVoice) => void;
}

export default function SelectableVoiceList(props: Props) {
  const { lang, voices, selectedVoice, selectVoice } = props;

  return (
    <div>{voices
      .filter((voice: ProviderVoice) => voice.lang === lang)
      .map((voice: ProviderVoice) => (
        <VoiceItem
          {...voice}
          selected={voice.voiceId === selectedVoice?.voiceId && voice.providerId === selectedVoice?.providerId}
          onSelected={() => selectVoice(voice)}
        />
      ))
    }</div>
  );
}
