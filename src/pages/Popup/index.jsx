import React from 'react';
import { createRoot } from 'react-dom/client';

import Popup from './Popup';
import { VoiceProvidersProvider } from '../../hooks/useVoiceProviders';
import { SelectedVoiceProvider } from '../../hooks/useSelectedVoice';
import { PinnedVoicesProvider } from '../../hooks/usePinnedVoices';
import { PinnedLangsProvider } from '../../hooks/usePinnedLangs';
import { SelectedLangProvider } from '../../hooks/useSelectedLang';

const container = document.getElementById('app-container');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <SelectedLangProvider>
    <PinnedLangsProvider>
      <VoiceProvidersProvider>
        <SelectedVoiceProvider>
          <PinnedVoicesProvider>
            <Popup/>
          </PinnedVoicesProvider>
        </SelectedVoiceProvider>
      </VoiceProvidersProvider>
    </PinnedLangsProvider>
  </SelectedLangProvider>
);
