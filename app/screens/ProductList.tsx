import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import ProductCard from '../../components/ProductCard';
import { ApiContext, Product } from '../context/ApiContext';
import { AuthContext } from '../context/AuthContext';
import { LoaderContext } from '../context/LoaderContext';
import { ThemeContext } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Products'>;

const ProductList: React.FC<Props> = ({ navigation }) => {
  const { products, fetchProducts } = useContext(ApiContext);
  const { logout } = useContext(AuthContext);
  const { loading } = useContext(LoaderContext);
  const { dark, toggleTheme } = useContext(ThemeContext);

  const [search, setSearch] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Animation for search bar
  const searchAnim = new Animated.Value(0);

  useEffect(() => {
    fetchProducts(true);
  }, []);

  useEffect(() => {
    // Animate search bar when it has focus
    Animated.timing(searchAnim, {
      toValue: search.length > 0 ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [search]);

  // Enhanced search with multiple fields
  const filteredProducts: Product[] = useMemo(() => {
    if (!search.trim()) return products;

    const searchLower = search.toLowerCase().trim();
    return products.filter(
      (product) =>
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        product.price.toString().includes(searchLower)
    );
  }, [products, search]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setHasMore(true);
      await fetchProducts(true);
      Toast.show({
        type: 'success',
        text1: 'Refreshed!',
        text2: 'Product list updated',
        position: 'top',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Refresh Failed',
        text2: error.message || 'Could not refresh products',
        position: 'top',
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      await fetchProducts();
      // Note: fakestoreapi doesn't support pagination properly, so we'll limit to first load
      if (products.length >= 20) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Load more error:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      Toast.show({
        type: 'success',
        text1: 'Logged out',
        text2: 'See you again!',
        position: 'top',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const clearSearch = () => {
    setSearch('');
  };

  const themeColors = dark
    ? {
        background: '#1a1a1a',
        surface: '#2d2d2d',
        text: '#ffffff',
        textSecondary: '#b0b0b0',
        primary: '#4a9eff',
        border: '#404040',
        inputBg: '#2d2d2d',
        cardBg: '#2d2d2d',
        headerBg: '#1f1f1f',
      }
    : {
        background: '#f5f7fa',
        surface: '#ffffff',
        text: '#1a1a1a',
        textSecondary: '#6b7280',
        primary: '#007bff',
        border: '#e5e7eb',
        inputBg: '#ffffff',
        cardBg: '#ffffff',
        headerBg: '#ffffff',
      };

  const styles = createStyles(themeColors, dark);

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: themeColors.headerBg }]}>
        <View style={styles.headerTop}>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>
            Products
          </Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.themeButton, { backgroundColor: themeColors.surface }]}
              onPress={toggleTheme}
            >
              <Text style={[styles.themeButtonText, { color: themeColors.text }]}>
                {dark ? '☀️' : '🌙'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.logoutButton, { backgroundColor: themeColors.primary }]}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchWrapper, { backgroundColor: themeColors.inputBg }]}>
            <Text style={[styles.searchIcon, { color: themeColors.textSecondary }]}>
              🔍
            </Text>
            <TextInput
              style={[styles.searchInput, { color: themeColors.text }]}
              placeholder="Search products by name, category, or price..."
              placeholderTextColor={themeColors.textSecondary}
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                <Text style={[styles.clearButtonText, { color: themeColors.textSecondary }]}>
                  ✕
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Search Results Count */}
        {search.length > 0 && (
          <Animated.View
            style={[
              styles.searchResults,
              {
                opacity: searchAnim,
                transform: [
                  {
                    translateY: searchAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-10, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={[styles.searchResultsText, { color: themeColors.textSecondary }]}>
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
            </Text>
          </Animated.View>
        )}
      </View>

      {/* Loading State */}
      {loading && products.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={themeColors.primary} />
          <Text style={[styles.loadingText, { color: themeColors.textSecondary }]}>
            Loading products...
          </Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyIcon, { color: themeColors.textSecondary }]}>
            📦
          </Text>
          <Text style={[styles.emptyText, { color: themeColors.text }]}>
            {search.length > 0 ? 'No products found' : 'No products available'}
          </Text>
          <Text style={[styles.emptySubtext, { color: themeColors.textSecondary }]}>
            {search.length > 0
              ? 'Try a different search term'
              : 'Pull down to refresh'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() =>
                navigation.navigate('Details', {
                  productId: item.id,
                })
              }
              dark={dark}
            />
          )}
          contentContainerStyle={styles.listContent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={themeColors.primary}
              colors={[themeColors.primary]}
            />
          }
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={themeColors.primary} />
                <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>
                  Loading more...
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

const createStyles = (colors: any, dark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      paddingTop: Platform.OS === 'ios' ? 50 : 20,
      paddingBottom: 16,
      paddingHorizontal: 16,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: dark ? 0.3 : 0.1,
      shadowRadius: 4,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
    },
    headerActions: {
      flexDirection: 'row',
      gap: 8,
    },
    themeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    themeButtonText: {
      fontSize: 20,
    },
    logoutButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoutButtonText: {
      color: '#ffffff',
      fontWeight: '600',
      fontSize: 14,
    },
    searchContainer: {
      marginBottom: 8,
    },
    searchWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: colors.border,
      paddingHorizontal: 12,
      height: 48,
    },
    searchIcon: {
      fontSize: 18,
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      paddingVertical: 0,
    },
    clearButton: {
      padding: 4,
      marginLeft: 8,
    },
    clearButtonText: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    searchResults: {
      marginTop: 8,
    },
    searchResultsText: {
      fontSize: 12,
      fontWeight: '500',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 12,
    },
    loadingText: {
      fontSize: 16,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    emptyIcon: {
      fontSize: 64,
      marginBottom: 16,
    },
    emptyText: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 8,
      textAlign: 'center',
    },
    emptySubtext: {
      fontSize: 14,
      textAlign: 'center',
    },
    listContent: {
      padding: 16,
      paddingBottom: 32,
    },
    footerLoader: {
      padding: 20,
      alignItems: 'center',
      gap: 8,
    },
    footerText: {
      fontSize: 12,
    },
  });

export default ProductList;
