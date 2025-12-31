import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, ViewStyle, ImageStyle, TextStyle } from 'react-native';

// You can move this type to a shared types file if preferred
export type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
};

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

const ProductCard = ({ product, onPress }: ProductCardProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>{product.price}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  } as ViewStyle,
  productImage: {
    height: 180,
    borderRadius: 16,
    backgroundColor: '#eee', // Added backgroundColor as requested
  } as ImageStyle,
  name: {
    fontSize: 14,
    marginTop: 8,
    color: '#000',
  } as TextStyle,
  price: {
    fontSize: 14,
    marginTop: 4,
    color: '#000',
  } as TextStyle,
});

export default ProductCard;