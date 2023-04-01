import { useEffect, useState } from 'react';
import { listVoices } from '../../models/backgroundMessages';
import { ProviderVoice } from '../../models/voiceProviders';
import { useVoiceProviders } from './useVoiceProviders';

type State = {
  availableVoices: { [providerId: string]: ProviderVoice[] },
}

export function useAvailableVoices(): State {
  const { voiceProviders } = useVoiceProviders();
  const [availableVoices, setVoices] = useState<{ [providerId: string]: ProviderVoice[] }>({});

  useEffect(() => {
    if (!voiceProviders) return;
    (async function() {
      for (const provider of voiceProviders) {
        const voices = await listVoices({ providerId: provider.id });
        setVoices(prev => ({ ...prev, [provider.id]: voices }));
      }
    })();
  }, [voiceProviders]);

  return { availableVoices };
}
