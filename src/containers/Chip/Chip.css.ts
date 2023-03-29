import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'inline-block',
  padding: '4px 8px',
  margin: '2px 3px',
  color: '#232F34FF',
  backgroundColor: '#232F341E',
  borderRadius: '20px',
});

export const clickableContainer = style([container, {
  cursor: 'pointer',
}]);
