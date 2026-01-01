// src/screens/search/SearchScreen.tsx
import React, { useState, useRef, useCallback } from 'react';
import { View, TextInput, Text, ActivityIndicator, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Assuming you have vector icons
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { searchService, SearchParams } from '../../services/searchService';
import FilterSortModal, { FilterResult } from '../../components/FilterSortModal';
import ProductCard from '../../components/ProductCard'; // Added


export default function SearchScreen({ navigation }: any)  {
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

  /**
   * Centralized Fetch Function
   * Combines the text query with the active filters to call the service
   * If resetPage is true, starts from page 1, else loads more
   */
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
      // 1. Map UI Filters to Service Parameters
      const serviceParams: SearchParams = {
        query: text,
        limit: 10,
        offset: resetPage ? 0 : results.length,
        minLimit: currentFilters.priceRange.min ? parseInt(currentFilters.priceRange.min) : undefined,
        maxLimit: currentFilters.priceRange.max ? parseInt(currentFilters.priceRange.max) : undefined,
        categoryId: currentFilters.categories.length > 0 ? parseInt(currentFilters.categories[0]) : undefined,
      };

      // 2. Call API
      const data = await searchService.searchProducts(serviceParams);

      if (resetPage) {
        setResults(data);
      } else {
        setResults(prev => [...prev, ...data]);
      }
      setHasMore(data.length === serviceParams.limit);
      if (resetPage) setPage(2);
      else setPage(prev => prev + 1);
    } catch (e) {
      setError('Network error or invalid search params');
      if (resetPage) setResults([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  // eslint-disable-next-line
  }, [results.length]);

  /**
   * Handle Text Change
   * Debounces the input and calls performSearch using current text + existing filters
   */
  const handleTextChange = (text: string) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      performSearch(text, activeFilters, true);
    }, 500);
  };

  /**
   * Handle Filter Apply
   * Updates filter state and immediately triggers search (no debounce needed for button press)
   */
  const handleFilterApply = (newFilters: FilterResult) => {
    setActiveFilters(newFilters);
    performSearch(query, newFilters, true);
  };

  /**
   * Load more results when reaching end of list
   */
  const handleLoadMore = () => {
    if (!loadingMore && hasMore && !loading && isOnline) {
      performSearch(query, activeFilters, false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Header Row */}
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
        {/* Filter Button */}
        <TouchableOpacity 
          style={[
            styles.filterBtn, 
            // Visual feedback if filters are active
            (activeFilters.categories.length > 0 || activeFilters.priceRange.min) && styles.filterBtnActive
          ]} 
          onPress={() => setFilterVisible(true)}
          disabled={!isOnline}
        >
          <Icon 
            name="sliders" 
            size={20} 
            color={(activeFilters.categories.length > 0 || activeFilters.priceRange.min) ? "#fff" : "#333"} 
          />
        </TouchableOpacity>
      </View>

      {/* Offline Warning */}
      {!isOnline && (
        <Text style={styles.offlineText}>Search is unavailable offline</Text>
      )}

      {/* Loading & Error States */}
      {loading && (
        <View style={{ marginTop: 20 }}>
          <ActivityIndicator size="large" color="#06b6d4" />
        </View>
      )}
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {/* Results List */}
      {!loading && !error && (
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
            query.length > 0 && !loading ? (
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

      {/* Filter Modal Component */}
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
  inputWrapper: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f1f1f1', 
    borderRadius: 8, 
    paddingHorizontal: 12, 
    height: 48 
  },
  input: { flex: 1, fontSize: 16, color: '#333' },
  filterBtn: { 
    marginLeft: 12, 
    width: 48, 
    height: 48, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 8, 
    backgroundColor: '#f1f1f1' 
  },
  filterBtnActive: { backgroundColor: '#06b6d4' },
  offlineText: { color: '#ef4444', marginBottom: 16, textAlign: 'center' },
  errorText: { color: '#ef4444', marginTop: 16, textAlign: 'center' },
  
  resultItem: { 
    paddingVertical: 16, 
    borderBottomWidth: 1, 
    borderColor: '#eee', 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  resultTitle: { fontSize: 16, fontWeight: '500', color: '#333' },
  resultSub: { fontSize: 12, color: '#888', marginTop: 4 },
  resultPrice: { fontSize: 16, fontWeight: 'bold', color: '#06b6d4' }
});