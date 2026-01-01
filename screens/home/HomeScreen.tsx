import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { categoryService } from '../../services/categoryService';
import { productService } from '../../services/productService';
import ProductCard from '../../components/ProductCard';
import Skeleton from '../../components/Skeleton';

const HomeScreen = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    const initData = async () => {
      try {
        setLoadingCategories(true);
        const fetchedCategories = await categoryService.getCategories();
        setCategories(fetchedCategories);

        // Requirement: Select the first category by default
        if (fetchedCategories && fetchedCategories.length > 0) {
          handleCategorySelect(fetchedCategories[0].id);
        }
      } catch (error) {
        console.error('Error initializing Home Screen:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    initData();
  }, []);

  const handleCategorySelect = async (id: string) => {
    setSelectedCategoryId(id);
    setLoadingProducts(true);
    try {
      const filteredProducts = await productService.getProducts(id);
      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error fetching products for category:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const renderCategoryItem = ({ item }: { item: any }) => {
    const isSelected = selectedCategoryId === item.id;
    return (
      <TouchableOpacity
        onPress={() => handleCategorySelect(item.id)}
        style={[styles.categoryItem, isSelected && styles.selectedCategoryItem]}
      >
        <View style={styles.categoryIconCircle} />
        <Text style={[styles.categoryText, isSelected && styles.selectedCategoryText]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* 1. Category Ribbon */}
      <View style={styles.categoryContainer}>
        {loadingCategories ? (
          <FlatList
            horizontal
            data={[1, 2, 3, 4]}
            keyExtractor={(i) => i.toString()}
            renderItem={() => (
              <View style={styles.skeletonItem}>
                <Skeleton width={60} height={60} borderRadius={30} />
                <View style={{ marginTop: 8 }}>
                  <Skeleton width={40} height={10} />
                </View>
              </View>
            )}
          />
        ) : (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCategoryItem}
          />
        )}
      </View>

      {/* 2. Product List of Selected Category */}
      <View style={styles.productListContainer}>
        <Text style={styles.sectionTitle}>
          {categories.find((c) => c.id === selectedCategoryId)?.name || 'Products'}
        </Text>

        {loadingProducts ? (
          <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={products}
            numColumns={2}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.productWrapper}>
                <ProductCard product={item} />
              </View>
            )}
            contentContainerStyle={styles.productGrid}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No products available in this category.</Text>
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  categoryContainer: { height: 110, paddingVertical: 10 },
  categoryItem: { alignItems: 'center', marginHorizontal: 12, paddingBottom: 5 },
  selectedCategoryItem: { borderBottomWidth: 2, borderBottomColor: '#000' },
  categoryIconCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#F3F4F6', marginBottom: 6 },
  categoryText: { fontSize: 12, color: '#6B7280' },
  selectedCategoryText: { fontWeight: 'bold', color: '#000' },
  skeletonItem: { marginRight: 15, alignItems: 'center' },
  productListContainer: { flex: 1, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  productGrid: { paddingBottom: 20 },
  productWrapper: { flex: 0.5, padding: 5 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#9CA3AF' },
});

export default HomeScreen;