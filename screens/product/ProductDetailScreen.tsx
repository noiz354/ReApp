// src/screens/product/ProductDetailScreen.tsx
import React, { useState } from 'react';
import { ScrollView, Image, Text, Button } from 'react-native';
import Skeleton from '../../components/Skeleton';

export default function ProductDetailScreen() {
  const [loaded, setLoaded] = useState(false);

  return (
    <ScrollView>
      {!loaded && <Skeleton height={300} />}
      <Image
        source={{ uri: 'https://picsum.photos/500' }}
        style={{ height: 300 }}
        onLoadEnd={() => setLoaded(true)}
      />
      <Text style={{ fontSize: 24 }}>Smart Watch Pro</Text>
      <Button title="Add to Cart" />
    </ScrollView>
  );
}
