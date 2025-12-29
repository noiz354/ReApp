// src/theme.ts
import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  roundness: 16,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#16A085',
    secondary: '#2ECC71',
    background: '#F6F8FA',
    surface: '#FFFFFF',
    error: '#E74C3C',
  },
};
