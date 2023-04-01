import React from 'react';
import classes from './SelectableList.module.css';

type Props = {
  items: SelectableListItem[];
  selected: string;
}

export type SelectableListItem = {
  label: string;
  value: string;
  onClick: () => void;
}

export default function SelectableList(props: Props) {
  const { items, selected } = props;
  return (
    <div className={classes.container}>
      {items.map(item => (
        <div
          key={item.value}
          className={item.value === selected ? classes.selectedItem : classes.item}
          onClick={item.value === selected ? undefined : item.onClick}
        >{item.label}</div>
      ))}
    </div>
  );
}
