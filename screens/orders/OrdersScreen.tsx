// src/screens/orders/OrdersScreen.tsx
import React from 'react';
import { ScrollView } from 'react-native';
import { List } from 'react-native-paper';

export default function OrdersScreen() {
  return (
    <ScrollView>
      <List.Item
        title="Order #123456"
        description="Shipped"
        left={(props) => <List.Icon {...props} icon="truck-delivery" />}
      />
      <List.Item
        title="Order #987654"
        description="Delivered"
        left={(props) => <List.Icon {...props} icon="check-circle-outline" />}
      />
    </ScrollView>
  );
}
