// src/screens/home/HomeScreen.tsx
import React, { useEffect } from 'react';
import { FlatList, Text, Image } from 'react-native';
import Skeleton from '../../components/Skeleton';
import OfflineBanner from '../../components/OfflineBanner';
import { useProductStore } from '../../store/productStore';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

export default function HomeScreen() {
  const { products, loadNext, loading } = useProductStore();
  const isOnline = useNetworkStatus();

  useEffect(() => {
    loadNext();
  }, []);

  return (
    <>
      {!isOnline && <OfflineBanner />}

      <FlatList
        data={products}
        keyExtractor={i => i.id}
        onEndReached={loadNext}
        onEndReachedThreshold={0.7}
        renderItem={({ item }) => (
          <>
            <Image source={{ uri: item.image }} style={{ height: 180, borderRadius: 16 }} />
            <Text>{item.name}</Text>
            <Text>{item.price}</Text>
          </>
        )}
        ListFooterComponent={loading ? <Skeleton height={150} /> : null}
      />
    </>
  );
}
