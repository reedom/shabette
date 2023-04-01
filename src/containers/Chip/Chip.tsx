import React from 'react';
import classes from './Chip.module.css';

type ChipProps = {
  label: string;
  color?: string;
  onClick?: () => void;
}
export default function Chip(props: ChipProps) {
  const { label, color } = props;
  return (
    <div
      className={props.onClick ? classes.clickableContainer : classes.container} style={{ backgroundColor: color }}
      onClick={props.onClick}
    >
      {label}
    </div>
  );
}
