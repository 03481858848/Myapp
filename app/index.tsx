import { useEffect } from 'react';
import { Platform } from 'react-native';
import AppNavigator from './navigation/AppNavigator';

export default function Index() {
  // Clear stored token on web for testing (remove in production)
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      // Uncomment to always start fresh
      // localStorage.removeItem('authToken');
    }
  }, []);

  return <AppNavigator />;
}

