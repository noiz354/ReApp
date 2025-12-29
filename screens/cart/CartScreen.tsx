// src/screens/cart/CartScreen.tsx
import React from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';
import { Text, Button } from 'react-native-paper';
import { loadingAnim } from '../../utils/animations';

export default function CartScreen() {
  const cartEmpty = true;

  if (cartEmpty) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LottieView source={loadingAnim} autoPlay loop style={{ height: 150 }} />
        <Text>Your cart is empty</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 16 }}>
      <Text>Items in Cart</Text>
      <Button mode="contained">Checkout</Button>
    </View>
  );
}
