import { style } from '@vanilla-extract/css';

export const body = style({
  width: 300,
  height: 260,
  margin: 0,
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen','Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  position: 'relative',
});

export const code = style({
  fontFamily: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New',   monospace",
});
