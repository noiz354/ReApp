// src/components/AnimatedHeader.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function AnimatedHeader({ title }: { title: string }) {
  return (
    <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
      <Text style={styles.text}>{title}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: { padding: 16 },
  text: { fontSize: 22, fontWeight: '700' },
});
