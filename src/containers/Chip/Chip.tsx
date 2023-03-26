import React from 'react';
import * as styles from './Chip.css';

type ChipProps = {
  label: string;
  color?: string;
}
export default function Chip(props: ChipProps) {
  const { label, color } = props;
  return (
    <div className={styles.container} style={{ backgroundColor: color }}>
      {label}
    </div>
  );
}
