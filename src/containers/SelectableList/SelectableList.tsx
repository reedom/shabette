import React from 'react';
import * as styles from './SelectableList.css';

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
    <div className={styles.container}>
      {items.map(item => (
        <div
          key={item.value}
          className={item.value === selected ? styles.selectedItem : styles.item}
          onClick={item.value === selected ? undefined : item.onClick}
        >{item.label}</div>
      ))}
    </div>
  );
}
