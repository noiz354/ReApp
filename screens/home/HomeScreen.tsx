import React, { useEffect } from 'react';
import { 
  FlatList, 
  Text, 
  Image, 
  TouchableOpacity, 
  View, 
  TextInput, 
  StyleSheet, 
  SafeAreaView 
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Skeleton from '../../components/Skeleton';
import OfflineBanner from '../../components/OfflineBanner';
import { useProductStore } from '../../store/productStore';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

export default function HomeScreen({ navigation }: any) {
  const { products, loadNext, loading } = useProductStore();
  const isOnline = useNetworkStatus();

  useEffect(() => {
    loadNext();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {!isOnline && <OfflineBanner />}

      {/* Header with Inbox Icon */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Text style={styles.brandTitle}>ReApp</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Chat')}
            style={styles.chatButton}
          >
            <Icon name="inbox" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity 
          style={styles.searchBar} 
          onPress={() => navigation.navigate('Search')}
        >
          <Icon name="search" size={18} color="#666" style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Search products...</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={i => i.id.toString()}
        onEndReached={loadNext}
        onEndReachedThreshold={0.7}
        contentContainerStyle={styles.listPadding}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
            style={styles.productItem}
          >
            <Image 
              source={{ uri: item.image }} 
              style={styles.productImage} 
            />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>{item.price}</Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={loading ? <Skeleton height={150} /> : null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  chatButton: {
    padding: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchPlaceholder: {
    color: '#666',
    fontSize: 14,
  },
  listPadding: {
    paddingHorizontal: 16,
  },
  productItem: {
    marginBottom: 16,
  },
  productImage: {
    height: 180, 
    borderRadius: 16,
    backgroundColor: '#eee',
  },
  productName: {
    fontSize: 16,
    marginTop: 8,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  }
});