import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { Product } from '../app/context/ApiContext';

interface Props {
  product: Product;
  onPress: () => void;
  dark?: boolean;
}

const ProductCard: React.FC<Props> = ({ product, onPress, dark = false }) => {
  const themeColors = dark
    ? {
        cardBg: '#2d2d2d',
        text: '#ffffff',
        textSecondary: '#b0b0b0',
        border: '#404040',
        price: '#4a9eff',
      }
    : {
        cardBg: '#ffffff',
        text: '#1a1a1a',
        textSecondary: '#6b7280',
        border: '#e5e7eb',
        price: '#007bff',
      };

  const styles = createStyles(themeColors, dark);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.info}>
        <Text style={[styles.category, { color: themeColors.textSecondary }]} numberOfLines={1}>
          {product.category.toUpperCase()}
        </Text>
        <Text style={[styles.title, { color: themeColors.text }]} numberOfLines={2}>
          {product.title}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: themeColors.price }]}>
            ${product.price.toFixed(2)}
          </Text>
        </View>
        <Text style={[styles.description, { color: themeColors.textSecondary }]} numberOfLines={2}>
          {product.description}
        </Text>
      </View>
      <View style={styles.arrowContainer}>
        <Text style={[styles.arrow, { color: themeColors.textSecondary }]}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (colors: any, dark: boolean) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      marginBottom: 16,
      padding: 16,
      backgroundColor: colors.cardBg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: dark ? 0.3 : 0.1,
      shadowRadius: 4,
    },
    imageContainer: {
      width: 100,
      height: 100,
      borderRadius: 8,
      backgroundColor: dark ? '#1a1a1a' : '#f9fafb',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    image: {
      width: 90,
      height: 90,
    },
    info: {
      flex: 1,
      justifyContent: 'space-between',
    },
    category: {
      fontSize: 10,
      fontWeight: '600',
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 6,
      lineHeight: 20,
    },
    priceContainer: {
      marginBottom: 6,
    },
    price: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    description: {
      fontSize: 12,
      lineHeight: 16,
    },
    arrowContainer: {
      justifyContent: 'center',
      paddingLeft: 8,
    },
    arrow: {
      fontSize: 24,
      fontWeight: '300',
    },
  });

export default ProductCard;
