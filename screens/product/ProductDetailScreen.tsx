// src/screens/product/ProductDetailScreen.tsx
import React, { useState } from 'react';
import { ScrollView, Image, Text, Button } from 'react-native';
import Skeleton from '../../components/Skeleton';

export default function ProductDetailScreen({ route }: any) {
  const [loaded, setLoaded] = useState(false);
  const product = route?.params?.product;

  const image = product?.image ?? 'https://picsum.photos/500';
  const name = product?.name ?? 'Product';
  const price = product?.price ?? '';

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {!loaded && <Skeleton height={300} />}
      <Image
        source={{ uri: image }}
        style={{ height: 300, borderRadius: 8, marginBottom: 12 }}
        onLoadEnd={() => setLoaded(true)}
      />
      <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 8 }}>{name}</Text>
      <Text style={{ fontSize: 18, color: '#555', marginBottom: 16 }}>{price}</Text>
      <Button title="Add to Cart" onPress={() => { /* TODO: add to cart */ }} />
    </ScrollView>
  );
}
