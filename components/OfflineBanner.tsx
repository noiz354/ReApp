// src/components/OfflineBanner.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function OfflineBanner() {
  return (
    <View style={styles.banner}>
      <Text style={styles.text}>You are offline · Showing cached data</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#F39C12',
    padding: 8,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontWeight: '600',
  },
});
