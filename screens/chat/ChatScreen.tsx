// src/screens/chat/ChatScreen.tsx
import React from 'react';
import { View, TextInput, Button } from 'react-native';

export default function ChatScreen() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={{ flex: 1 }} />
      <TextInput placeholder="Type message" />
      <Button title="Send" />
    </View>
  );
}
