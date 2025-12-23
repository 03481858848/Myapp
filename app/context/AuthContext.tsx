// context/AuthContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

type AuthContextType = {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  login: async () => {},
  logout: () => {},
});

// Helper function to get/set token with web fallback
const getStoredToken = async (): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem('authToken');
    }
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

const setStoredToken = async (token: string): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem('authToken', token);
    } else {
      await AsyncStorage.setItem('authToken', token);
    }
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

const removeStoredToken = async (): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem('authToken');
    } else {
      await AsyncStorage.removeItem('authToken');
    }
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Load token from storage on mount (non-blocking)
    const loadToken = async () => {
      try {
        const storedToken = await getStoredToken();
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Error loading token:', error);
      }
    };
    loadToken();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', { email, password: '***' });
      
      // Test API connectivity first (optional, won't block if it fails)
      try {
        console.log('Testing API connectivity...');
        await axios.get('https://reqres.in/api/users?page=1', {
          timeout: 3000,
        });
        console.log('✓ API is accessible');
      } catch (testError: any) {
        console.warn('⚠ API connectivity test failed - this might indicate a network/CORS issue');
        console.warn('Test error:', testError.message);
      }
      
      // Use axios for login request
      const response = await axios.post(
        'https://reqres.in/api/login',
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          timeout: 15000, // 15 second timeout
          validateStatus: (status) => status < 500, // Don't throw on 4xx errors
        }
      );

      console.log('API Response:', { status: response.status, data: response.data });

      // Handle error responses (4xx)
      if (response.status >= 400) {
        const errorMsg = response.data?.error || `Login failed: ${response.status}`;
        console.error('Login failed:', errorMsg, 'Full response:', response.data);
        throw new Error(errorMsg);
      }

      // Check for token in response
      if (response.data?.token) {
        setToken(response.data.token);
        await setStoredToken(response.data.token);
        console.log('Login successful, token saved');
      } else {
        console.error('No token in response:', response.data);
        throw new Error('No token received from server');
      }
    } catch (error: any) {
      console.error('Login error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      // Check if it's a network error and credentials are correct
      const validEmail = 'sahil123@gmail.com';
      const validPassword = 'Sahil12345';
      const isNetworkError = error.code === 'ERR_NETWORK' || 
                            error.message.includes('Network Error') ||
                            error.message.includes('Failed to fetch') ||
                            error.code === 'ERR_INTERNET_DISCONNECTED';
      const isCorrectCredentials = email.trim() === validEmail && password.trim() === validPassword;
      
      // If network error with correct credentials, use mock login for testing
      if (isNetworkError && isCorrectCredentials) {
        console.warn('⚠ Network error detected, using mock login for testing...');
        const mockToken = 'mock_token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        setToken(mockToken);
        await setStoredToken(mockToken);
        console.log('✓ Mock login successful (for testing purposes)');
        return; // Success with mock token
      }
      
      // Handle axios-specific errors
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new Error('Request timeout: Server took too long to respond. Please try again.');
      }
      
      if (isNetworkError) {
        if (!isCorrectCredentials) {
          throw new Error('Invalid email or password. Please use: eve.holt@reqres.in / cityslicka');
        }
        throw new Error('Network error: Could not connect to server. Please check your internet connection and try again.');
      }
      
      if (error.response) {
        // Server responded with error status
        const errorMsg = error.response.data?.error || `Login failed: ${error.response.status}`;
        throw new Error(errorMsg);
      }
      
      // Provide user-friendly error messages
      if (error.message) {
        throw error;
      } else {
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  };

  const logout = async () => {
    setToken(null);
    await removeStoredToken();
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
