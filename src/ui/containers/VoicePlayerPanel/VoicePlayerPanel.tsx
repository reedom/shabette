import React from 'react';
import { startTextSelectionMode, stopTextSelectionMode } from '../../../models/contentMessages';

type Props = {}

export default function VoicePlayerPanel() {
  return (
    <div>
      <button onClick={startTextSelectionMode}>Select</button>
      <button onClick={() => stopTextSelectionMode()}>Stop</button>
    </div>
  );
}
