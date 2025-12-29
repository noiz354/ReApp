// src/screens/checkout/CheckoutScreen.tsx
import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';

export default function CheckoutScreen() {
  return (
    <View style={{ padding: 16 }}>
      <Text>Select Payment Method</Text>
      <Button mode="contained" icon="credit-card" style={{ marginTop: 12 }}>
        Pay Now
      </Button>
    </View>
  );
}
