import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

interface BearAvatarProps {
  imageSource: any;
}

export const BearAvatar = ({ imageSource }: BearAvatarProps) => {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Image 
        source={imageSource} 
        style={styles.bearImage} 
        resizeMode="contain" 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  bearImage: {
    width: 150,
    height: 150,
  },
});