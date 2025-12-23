import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { ApiContext, Product } from '../context/ApiContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { ThemeContext } from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

const ProductDetails: React.FC<Props> = ({ route, navigation }) => {
  const { productId } = route.params;
  const { products } = useContext(ApiContext);
  const { dark } = useContext(ThemeContext);

  const product: Product | undefined = products.find((p) => p.id === productId);

  const themeColors = dark
    ? {
        background: '#1a1a1a',
        surface: '#2d2d2d',
        text: '#ffffff',
        textSecondary: '#b0b0b0',
        primary: '#4a9eff',
        border: '#404040',
        imageBg: '#1a1a1a',
      }
    : {
        background: '#f5f7fa',
        surface: '#ffffff',
        text: '#1a1a1a',
        textSecondary: '#6b7280',
        primary: '#007bff',
        border: '#e5e7eb',
        imageBg: '#f9fafb',
      };

  const styles = createStyles(themeColors, dark);

  if (!product) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorIcon, { color: themeColors.textSecondary }]}>
            ⚠️
          </Text>
          <Text style={[styles.errorText, { color: themeColors.text }]}>
            Product not found
          </Text>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: themeColors.primary }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Section */}
        <View style={[styles.imageContainer, { backgroundColor: themeColors.imageBg }]}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Content Section */}
        <View style={[styles.content, { backgroundColor: themeColors.surface }]}>
          {/* Category Badge */}
          <View style={[styles.categoryBadge, { backgroundColor: themeColors.primary + '20' }]}>
            <Text style={[styles.categoryText, { color: themeColors.primary }]}>
              {product.category.toUpperCase()}
            </Text>
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: themeColors.text }]}>
            {product.title}
          </Text>

          {/* Price */}
          <View style={styles.priceSection}>
            <Text style={[styles.price, { color: themeColors.primary }]}>
              ${product.price.toFixed(2)}
            </Text>
            <Text style={[styles.priceLabel, { color: themeColors.textSecondary }]}>
              Price
            </Text>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Description
            </Text>
            <Text style={[styles.description, { color: themeColors.textSecondary }]}>
              {product.description}
            </Text>
          </View>

          {/* Product Info */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>
                Product ID
              </Text>
              <Text style={[styles.infoValue, { color: themeColors.text }]}>
                #{product.id}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>
                Category
              </Text>
              <Text style={[styles.infoValue, { color: themeColors.text }]}>
                {product.category}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: any, dark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 32,
    },
    imageContainer: {
      width: '100%',
      height: 350,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    content: {
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      marginTop: -24,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: dark ? 0.3 : 0.1,
      shadowRadius: 8,
    },
    categoryBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      marginBottom: 16,
    },
    categoryText: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      lineHeight: 32,
    },
    priceSection: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginBottom: 24,
      gap: 8,
    },
    price: {
      fontSize: 32,
      fontWeight: 'bold',
    },
    priceLabel: {
      fontSize: 14,
      marginLeft: 4,
    },
    divider: {
      height: 1,
      marginVertical: 24,
    },
    descriptionSection: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 12,
    },
    description: {
      fontSize: 15,
      lineHeight: 24,
    },
    infoSection: {
      marginTop: 8,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
    },
    infoLabel: {
      fontSize: 14,
      fontWeight: '500',
    },
    infoValue: {
      fontSize: 14,
      fontWeight: '600',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    errorIcon: {
      fontSize: 64,
      marginBottom: 16,
    },
    errorText: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 24,
      textAlign: 'center',
    },
    backButton: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    backButtonText: {
      color: '#ffffff',
      fontWeight: '600',
      fontSize: 16,
    },
  });

export default ProductDetails;
