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
      <UnselectedIcon/>
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

const SelectedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <g fill="none" fill-rule="evenodd">
      <path fill="#000" d="M12.154 4.02a.5.5 0 01.6.8l-6.001 7a.5.5 0 01-.6 0l-3-3a.5.5 0 11.6-.8l2.523 2.524z"/>
      <path d="M7.154 3.02a1.5 1.5 0 011.938 0l6.001 7a1.5 1.5 0 010 1.962l-3 3a1.5 1.5 0 01-1.962.001l-6.001-7a1.5 1.5 0 010-1.962l3-3z"/>
    </g>
  </svg>
);

const UnselectedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <g fill="none" fill-rule="evenodd">
      <path d="M11.154 4.02a.5.5 0 01.6.8l-6.001 7a.5.5 0 01-.6 0l-3-3a.5.5 0 01.6-.8l2.523 2.524z"/>
      <path d="M8 2.5a1.5 1.5 0 011.5 1.5v8a1.5 1.5 0 01-3 0v-8a1.5 1.5 0 011.5-1.5z"/>
    </g>
  </svg>
);

