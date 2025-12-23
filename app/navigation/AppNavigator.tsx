// navigation/AppNavigator.tsx
import { NavigationIndependentTree } from '@react-navigation/core';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import ProductDetails from '../screens/ProductDetails';
import ProductList from '../screens/ProductList';

export type RootStackParamList = {
  Login: undefined;
  Products: undefined;
  Details: { productId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { token } = useContext(AuthContext);
  const navigationRef = useNavigationContainerRef<RootStackParamList>();

  useEffect(() => {
    if (!navigationRef.isReady()) {
      return;
    }

    const targetRoute = token ? 'Products' : 'Login';
    const currentRoute = navigationRef.getCurrentRoute();

    // Only navigate if we're on a different route
    if (currentRoute && currentRoute.name !== targetRoute) {
      navigationRef.reset({
        index: 0,
        routes: [{ name: targetRoute }],
      });
    }
  }, [token, navigationRef]);

  // Use NavigationIndependentTree to avoid nested NavigationContainer error
  // This is required when using React Navigation inside Expo Router
  return (
    <NavigationIndependentTree>
      <NavigationContainer 
        ref={navigationRef}
        key={token ? 'authenticated' : 'unauthenticated'}
      >
        <Stack.Navigator 
          screenOptions={{ headerShown: true }}
          initialRouteName="Login"
        >
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Products" 
            component={ProductList} 
            options={{ title: 'Products' }} 
          />
          <Stack.Screen
            name="Details"
            component={ProductDetails}
            options={{ title: 'Product Details' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
};

export default AppNavigator;
