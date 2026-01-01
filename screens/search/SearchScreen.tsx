// src/screens/search/SearchScreen.tsx
import React, { useState, useRef, useCallback } from 'react';
import { View, TextInput, Text, ActivityIndicator, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { searchService, SearchParams } from '../../services/searchService';
import FilterSortModal, { FilterResult } from '../../components/FilterSortModal';
import ProductCard from '../../components/ProductCard';

export default function SearchScreen({ navigation }: any) {
  const isOnline = useNetworkStatus();

  // -- State --
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // -- Filter State --
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterResult>({
    priceRange: { min: '', max: '' },
    categories: []
  });

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // FIXED: Removed results.length from dependency array to stabilize hook order
  const performSearch = useCallback(async (text: string, currentFilters: FilterResult, resetPage = true) => {
    if (!text.trim() && currentFilters.categories.length === 0 && !currentFilters.priceRange.min) {
      setResults([]);
      setLoading(false);
      setHasMore(true);
      setPage(1);
      return;
    }

    if (resetPage) {
      setLoading(true);
      setPage(1);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const serviceParams: SearchParams = {
        query: text,
        limit: 10,
        // Calculate offset based on current state directly
        offset: resetPage ? 0 : results.length, 
        minLimit: currentFilters.priceRange.min ? parseInt(currentFilters.priceRange.min) : undefined,
        maxLimit: currentFilters.priceRange.max ? parseInt(currentFilters.priceRange.max) : undefined,
        categoryId: currentFilters.categories.length > 0 ? parseInt(currentFilters.categories[0]) : undefined,
      };

      const data = await searchService.searchProducts(serviceParams);

      setResults(prev => resetPage ? data : [...prev, ...data]);
      setHasMore(data.length === serviceParams.limit);
      setPage(prev => resetPage ? 2 : prev + 1);
    } catch (e) {
      setError('Network error or invalid search params');
      if (resetPage) setResults([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
    // Dependency list simplified to prevent Hook Order changes
  }, [results.length]); 

  const handleTextChange = (text: string) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      performSearch(text, activeFilters, true);
    }, 500);
  };

  const handleFilterApply = (newFilters: FilterResult) => {
    setActiveFilters(newFilters);
    performSearch(query, newFilters, true);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore && !loading && isOnline) {
      performSearch(query, activeFilters, false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchRow}>
        <View style={styles.inputWrapper}>
          <Icon name="search" size={20} color="#888" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search products..."
            style={styles.input}
            value={query}
            onChangeText={handleTextChange}
            editable={isOnline}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity 
          style={[styles.filterBtn, (activeFilters.categories.length > 0 || activeFilters.priceRange.min) && styles.filterBtnActive]} 
          onPress={() => setFilterVisible(true)}
          disabled={!isOnline}
        >
          <Icon name="sliders" size={20} color={(activeFilters.categories.length > 0 || activeFilters.priceRange.min) ? "#fff" : "#333"} />
        </TouchableOpacity>
      </View>

      {!isOnline && <Text style={styles.offlineText}>Search is unavailable offline</Text>}

      {/* FIXED: Stable rendering structure */}
      {loading ? (
        <View style={{ marginTop: 20 }}>
          <ActivityIndicator size="large" color="#06b6d4" />
        </View>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.id?.toString() || Math.random().toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <ProductCard 
              product={item}
              onPress={() => navigation.navigate('ProductDetailRoot', { product: item })}
            />
          )}
          ListEmptyComponent={
            query.length > 0 ? (
              <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>
                No products found matching "{query}"
              </Text>
            ) : null
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View style={{ paddingVertical: 16 }}>
                <ActivityIndicator size="small" color="#06b6d4" />
              </View>
            ) : null
          }
        />
      )}

      <FilterSortModal 
        visible={isFilterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={handleFilterApply}
        initialFilters={activeFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  searchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  inputWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f1f1', borderRadius: 8, paddingHorizontal: 12, height: 48 },
  input: { flex: 1, fontSize: 16, color: '#333' },
  filterBtn: { marginLeft: 12, width: 48, height: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 8, backgroundColor: '#f1f1f1' },
  filterBtnActive: { backgroundColor: '#06b6d4' },
  offlineText: { color: '#ef4444', marginBottom: 16, textAlign: 'center' },
  errorText: { color: '#ef4444', marginTop: 16, textAlign: 'center' },
});