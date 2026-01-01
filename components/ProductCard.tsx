import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, ViewStyle, ImageStyle, TextStyle } from 'react-native';
import { CreateProductDto } from '../services/productService';


interface ProductCardProps {
  product: CreateProductDto;
  onPress: () => void;
}

const ProductCard = ({ product, onPress }: ProductCardProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image source={{ uri: product.images[0] }} style={styles.productImage} />
      <Text style={styles.name}>{product.title}</Text>
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