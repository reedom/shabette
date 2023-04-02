import React from 'react';
import VoiceSelectionPanel from '../../containers/VoiceSelectionPanel';
import VoicePlayerPanel from '../../containers/VoicePlayerPanel';

const Popup = () => {
  return (
    <>
      <VoicePlayerPanel/>
      <VoiceSelectionPanel/>
    </>
  );
};

export default Popup;
