import { keyframes, style } from '@vanilla-extract/css';

export const app = style({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  textAlign: 'center',
  height: '100%',
  padding: 10,
  backgroundColor: '#282c34',
});

export const AppLogo = style({
  height: '30vmin',
  pointerEvents: 'none',
  // animation: 'App-logo-spin infinite 20s linear',
});

export const AppHeader = style({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 'calc(10px + 2vmin)',
  color: 'white',
});

export const AppLink = style({
  color: '#61dafb',
});

// export const a = keyframes({
//
//   'App-logo-spin': {
//     from: { transform: 'rotate(0deg)' },
//     to: { transform: 'rotate(360deg)' }
//   }
// });
