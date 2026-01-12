export const colorPrimaryMain = '#018790';

export const lightTheme = {
  palette: {
    mode: 'light' as PaletteMode,
    primary: {
      main: colorPrimaryMain,
      light: '#00B7B5',
      dark: '#005461',
    },
    secondary: {
      main: '#005461',
      light: colorPrimaryMain,
      dark: '#003940',
    },
    background: {
      default: '#F4F4F4',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#005461',
      secondary: colorPrimaryMain,
    },
    action: {
      hover: 'rgba(1, 135, 144, 0.12)',
      selected: 'rgba(1, 135, 144, 0.20)',
    },
  },
};

export const darkTheme = {
  palette: {
    mode: 'dark' as PaletteMode,
    primary: {
      main: '#00B7B5',
      light: '#00E5E3',
      dark: colorPrimaryMain,
    },
    secondary: {
      main: colorPrimaryMain,
      light: '#00B7B5',
      dark: '#005461',
    },
    background: {
      default: '#303030',
      paper: '#2a2a2a',
    },
    text: {
      primary: '#E0E0E0',
      secondary: '#00B7B5',
    },
    action: {
      hover: 'rgba(0, 183, 181, 0.15)',
      selected: 'rgba(0, 183, 181, 0.25)',
    },
  },
};
