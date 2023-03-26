import React from 'react';
import { Gender, VoiceProviderId } from '../../models/voiceProviders';
import Chip from '../Chip';

type Props = {
  providerId: VoiceProviderId;
  voiceId: string;
  dialect?: string[];
  gender: Gender;
  selected: boolean;
  onSelected: () => void;
}

export default function VoiceItem(props: Props) {
  const { providerId, voiceId, dialect, selected, onSelected, gender } = props;
  return (
    <div key={voiceId} className="language-item">
      <label>
        <input
          type="radio"
          name="voice"
          value={voiceId}
          checked={selected}
          onChange={onSelected}
        />
        {voiceId}
      </label>
      <Chip label={gender}/>{dialect?.map(lang => <Chip label={lang}/>)}
    </div>
  )
}
