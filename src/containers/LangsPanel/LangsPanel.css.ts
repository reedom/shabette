import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'block',
  padding: '4px 8px',
  margin: '2px 3px',
});

export const item = style({
  display: 'inline-block',
  padding: '4px 8px',
  margin: '2px 3px',
  color: '#232F34FF',
  cursor: 'pointer'
});

export const selectedItem = style([item, {
  textDecoration: 'underline',
  cursor: 'default'
}]);
