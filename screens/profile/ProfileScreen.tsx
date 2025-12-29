// src/screens/profile/ProfileScreen.tsx
import React from 'react';
import { ScrollView } from 'react-native';
import { List, Avatar } from 'react-native-paper';

export default function ProfileScreen() {
  return (
    <ScrollView>
      <Avatar.Icon size={96} icon="account-circle" style={{ margin: 16 }} />
      <List.Item title="My Orders" left={(props) => <List.Icon {...props} icon="receipt" />} />
      <List.Item title="Wishlist" left={(props) => <List.Icon {...props} icon="heart-outline" />} />
      <List.Item title="Logout" left={(props) => <List.Icon {...props} icon="logout" />} />
    </ScrollView>
  );
}
