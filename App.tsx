import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import RootNavigator from './navigation/RootNavigator';
import { theme } from './theme';

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}