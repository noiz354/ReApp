// src/components/FilterSortModal.tsx
import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, 
  TextInput, Platform, KeyboardAvoidingView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

// Mapped to resemble real DB IDs for categoryId parameter
const CATEGORY_OPTIONS = [
  { id: '1', label: 'Electronics' },
  { id: '2', label: 'Fashion' },
  { id: '3', label: 'Home & Living' },
  { id: '4', label: 'Books' },
];

export interface FilterResult {
  priceRange: { min: string; max: string };
  categories: string[];
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterResult) => void;
  initialFilters?: FilterResult;
}

export default function FilterSortModal({ visible, onClose, onApply, initialFilters }: FilterModalProps) {
  const [selectedCats, setSelectedCats] = useState<string[]>(initialFilters?.categories || []);
  const [minPrice, setMinPrice] = useState(initialFilters?.priceRange.min || '');
  const [maxPrice, setMaxPrice] = useState(initialFilters?.priceRange.max || '');

  const toggleCategory = (id: string) => {
    // For this API, let's assume single category selection for simplicity, 
    // or keep array if backend supports multiple. Here we toggle.
    if (selectedCats.includes(id)) {
      setSelectedCats(selectedCats.filter(c => c !== id));
    } else {
      setSelectedCats([id]); // If API only supports one categoryId, replace array with new ID
    }
  };

  const handleApply = () => {
    onApply({
      categories: selectedCats,
      priceRange: { min: minPrice, max: maxPrice }
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}><Icon name="x" size={24} color="#000" /></TouchableOpacity>
            <Text style={styles.headerTitle}>Filter Products</Text>
            <TouchableOpacity onPress={() => { setMinPrice(''); setMaxPrice(''); setSelectedCats([]); }}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            {/* Price Range */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price Range (Limit)</Text>
              <View style={styles.priceRow}>
                <TextInput 
                  style={styles.priceInput} 
                  placeholder="Min" 
                  keyboardType="numeric" 
                  value={minPrice} 
                  onChangeText={setMinPrice} 
                />
                <View style={styles.dash} />
                <TextInput 
                  style={styles.priceInput} 
                  placeholder="Max" 
                  keyboardType="numeric" 
                  value={maxPrice} 
                  onChangeText={setMaxPrice} 
                />
              </View>
            </View>

            <View style={styles.divider} />

            {/* Categories */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Category</Text>
              <View style={styles.wrapContainer}>
                {CATEGORY_OPTIONS.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.chip, selectedCats.includes(cat.id) ? styles.chipActive : styles.chipInactive]}
                    onPress={() => toggleCategory(cat.id)}
                  >
                    <Text style={[styles.chipText, selectedCats.includes(cat.id) ? styles.chipTextActive : styles.chipTextInactive]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
              <Text style={styles.applyBtnText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderColor: '#eee', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  resetText: { color: '#06b6d4' },
  content: { padding: 20 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  divider: { height: 1, backgroundColor: '#eee', marginBottom: 20 },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  priceInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, textAlign: 'center' },
  dash: { width: 10, height: 1, backgroundColor: '#888', marginHorizontal: 10 },
  wrapContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, marginBottom: 8, borderWidth: 1 },
  chipInactive: { backgroundColor: '#fff', borderColor: '#ddd' },
  chipActive: { backgroundColor: '#e0f7fa', borderColor: '#06b6d4' },
  chipText: { fontSize: 13 },
  chipTextActive: { color: '#06b6d4', fontWeight: 'bold' },
  chipTextInactive: { color: '#555' },
  footer: { padding: 16, borderTopWidth: 1, borderColor: '#eee' },
  applyBtn: { backgroundColor: '#06b6d4', padding: 16, borderRadius: 30, alignItems: 'center' },
  applyBtnText: { color: '#fff', fontWeight: 'bold' }
});