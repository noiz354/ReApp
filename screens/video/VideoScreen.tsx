// src/screens/video/VideoScreen.tsx
import React from 'react';
import { View } from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';

export default function VideoScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Video
        source={{ uri: 'https://www.w3schools.com/html/mov_bbb.mp4' }}
        style={{ flex: 1 }}
        controls
      />
      <Icon name="heart-circle" size={48} color="#16A085" style={{ position: 'absolute', bottom: 24, right: 24 }} />
    </View>
  );
}
