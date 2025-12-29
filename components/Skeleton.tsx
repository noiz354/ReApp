// src/components/Skeleton.tsx
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function Skeleton({ height = 120 }) {
  const translateX = useSharedValue(-width);

  React.useEffect(() => {
    translateX.value = withRepeat(
      withTiming(width, { duration: 1200 }),
      -1
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={[styles.container, { height }]}>
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          colors={['#E0E0E0', '#F5F5F5', '#E0E0E0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
    borderRadius: 16,
    marginVertical: 8,
  },
});
