import React from 'react';
import { createRoot } from 'react-dom/client';

import Popup from './Popup';
import { VoiceProvidersProvider } from '../../hooks/useVoiceProviders';
import { SelectedVoiceProvider } from '../../hooks/useSelectedVoice';
import { PinnedVoicesProvider } from '../../hooks/usePinnedVoices';

console.log('installing');

const container = document.getElementById('app-container');
console.log('container', container ? 'found' : 'not found');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <VoiceProvidersProvider>
    <SelectedVoiceProvider>
      <PinnedVoicesProvider>
        <Popup/>
      </PinnedVoicesProvider>
    </SelectedVoiceProvider>
  </VoiceProvidersProvider>
);
