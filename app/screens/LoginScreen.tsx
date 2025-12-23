import React, { useContext, useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../context/AuthContext';
import { LoaderContext } from '../context/LoaderContext';
import { ThemeContext } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const LoginScreen: React.FC = () => {
  const { login } = useContext(AuthContext);
  const { loading, setLoading } = useContext(LoaderContext);
  const { dark, toggleTheme } = useContext(ThemeContext);

  const [email, setEmail] = useState<string>('sahil123@gmail.com');
  const [password, setPassword] = useState<string>('Sahil12345');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);

  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  const scaleAnim = new Animated.Value(0.9);

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Keyboard listeners
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password.trim()) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.trim().length < 3) {
      setPasswordError('Password must be at least 3 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = async () => {
    Keyboard.dismiss();
    
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Validate inputs
    const isEmailValid = validateEmail(trimmedEmail);
    const isPasswordValid = validatePassword(trimmedPassword);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    try {
      setLoading(true);
      await login(trimmedEmail, trimmedPassword);
      Toast.show({
        type: 'success',
        text1: 'Welcome!',
        text2: 'Login successful. Redirecting...',
        position: 'top',
      });
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = error?.message || 'Invalid credentials';
      
      // User-friendly error messages
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Network error')) {
        errorMessage = 'Network error: Please check your internet connection';
      } else if (errorMessage.includes('timeout')) {
        errorMessage = 'Request timeout: Please try again';
      } else if (errorMessage.includes('user not found') || errorMessage.includes('Invalid')) {
        errorMessage = 'Invalid email or password';
      }
      
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const themeColors = dark
    ? {
        background: '#1a1a1a',
        surface: '#2d2d2d',
        text: '#ffffff',
        textSecondary: '#b0b0b0',
        primary: '#4a9eff',
        primaryDark: '#357abd',
        border: '#404040',
        error: '#ff6b6b',
        inputBg: '#2d2d2d',
      }
    : {
        background: '#f5f7fa',
        surface: '#ffffff',
        text: '#1a1a1a',
        textSecondary: '#6b7280',
        primary: '#007bff',
        primaryDark: '#0056b3',
        border: '#e5e7eb',
        error: '#ef4444',
        inputBg: '#ffffff',
      };

  const styles = createStyles(themeColors, dark);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.welcomeText, { color: themeColors.text }]}>
            Welcome
          </Text>
          <Text style={[styles.title, { color: themeColors.text }]}>
            Context API Explorer
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            Professional React Native App
          </Text>
        </View>

        {/* Theme Toggle */}
        <TouchableOpacity
          style={[styles.themeToggle, { backgroundColor: themeColors.surface }]}
          onPress={toggleTheme}
        >
          <Text style={[styles.themeToggleText, { color: themeColors.text }]}>
            {dark ? '☀️ Light' : '🌙 Dark'}
          </Text>
        </TouchableOpacity>

        {/* Login Form */}
        <View style={[styles.form, { backgroundColor: themeColors.surface }]}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: themeColors.text }]}>Email</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: themeColors.inputBg,
                  borderColor: emailError ? themeColors.error : themeColors.border,
                  color: themeColors.text,
                },
              ]}
              placeholder="Enter your email"
              placeholderTextColor={themeColors.textSecondary}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) validateEmail(text);
              }}
              onBlur={() => validateEmail(email)}
              editable={!loading}
            />
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: themeColors.text }]}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.passwordInput,
                  {
                    backgroundColor: themeColors.inputBg,
                    borderColor: passwordError ? themeColors.error : themeColors.border,
                    color: themeColors.text,
                  },
                ]}
                placeholder="Enter your password"
                placeholderTextColor={themeColors.textSecondary}
                secureTextEntry={!showPassword}
                autoComplete="password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) validatePassword(text);
                }}
                onBlur={() => validatePassword(password)}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={[styles.eyeIconText, { color: themeColors.textSecondary }]}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: loading ? themeColors.primaryDark : themeColors.primary,
                opacity: loading ? 0.7 : 1,
              },
            ]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.buttonText}>Logging in...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

        </View>

        {/* Features List */}
        {!keyboardVisible && (
          <View style={styles.featuresContainer}>
            <Text style={[styles.featuresTitle, { color: themeColors.textSecondary }]}>
              ✨ Features
            </Text>
            <View style={styles.featuresList}>
              <Text style={[styles.featureItem, { color: themeColors.textSecondary }]}>
                ✓ AuthContext with Auto Login
              </Text>
              <Text style={[styles.featureItem, { color: themeColors.textSecondary }]}>
                ✓ Product List with Search
              </Text>
              <Text style={[styles.featureItem, { color: themeColors.textSecondary }]}>
                ✓ Dark/Light Theme
              </Text>
              <Text style={[styles.featureItem, { color: themeColors.textSecondary }]}>
                ✓ Pull to Refresh
              </Text>
            </View>
          </View>
        )}
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const createStyles = (colors: any, dark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: 24,
      justifyContent: 'center',
    },
    header: {
      alignItems: 'center',
      marginBottom: 40,
    },
    welcomeText: {
      fontSize: 42,
      fontWeight: 'bold',
      marginBottom: 12,
      textAlign: 'center',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 8,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      textAlign: 'center',
    },
    themeToggle: {
      position: 'absolute',
      top: Platform.OS === 'web' ? 20 : 40,
      right: 20,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    themeToggleText: {
      fontSize: 14,
      fontWeight: '600',
    },
    form: {
      borderRadius: 16,
      padding: 24,
      marginBottom: 24,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: dark ? 0.3 : 0.1,
      shadowRadius: 8,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 8,
    },
    input: {
      height: 52,
      borderWidth: 1.5,
      borderRadius: 12,
      paddingHorizontal: 16,
      fontSize: 16,
    },
    passwordContainer: {
      position: 'relative',
    },
    passwordInput: {
      height: 52,
      borderWidth: 1.5,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingRight: 50,
      fontSize: 16,
    },
    eyeIcon: {
      position: 'absolute',
      right: 16,
      top: 14,
      padding: 4,
    },
    eyeIconText: {
      fontSize: 20,
    },
    errorText: {
      color: colors.error,
      fontSize: 12,
      marginTop: 4,
      marginLeft: 4,
    },
    button: {
      height: 52,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 8,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    featuresContainer: {
      alignItems: 'center',
    },
    featuresTitle: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 12,
    },
    featuresList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 12,
    },
    featureItem: {
      fontSize: 12,
      paddingHorizontal: 8,
    },
  });

export default LoginScreen;
