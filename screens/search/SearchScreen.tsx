// src/screens/search/SearchScreen.tsx
import React from 'react';
import { View, TextInput, Text } from 'react-native';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

export default function SearchScreen() {
  const isOnline = useNetworkStatus();

  return (
    <View style={{ padding: 16 }}>
      <TextInput placeholder="Search products" style={{ borderWidth: 1, padding: 8 }} />
      {!isOnline && (
        <Text style={{ marginTop: 16 }}>
          Search is unavailable offline
        </Text>
      )}
    </View>
  );
}
