import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const { height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Animasyon değerini useRef ile optimize ediyoruz
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Basitleştirilmiş animasyon
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert('Uyarı', 'Lütfen e-posta adresinizi girin.');
      return false;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      Alert.alert('Uyarı', 'Lütfen geçerli bir e-posta adresi girin.');
      return false;
    }

    if (!password.trim()) {
      Alert.alert('Uyarı', 'Lütfen şifrenizi girin.');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Uyarı', 'Şifreniz en az 6 karakter olmalıdır.');
      return false;
    }

    return true;
  };

  const passLogin = () => {
    navigation.replace('MainTabs');
  }

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await api.post('/Auth/login', {
        email: email.trim(),
        password: password
      });

      const { token, expiration } = response.data;
      
      // Token'ı AsyncStorage'a kaydet
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('tokenExpiration', expiration);
      
      // API çağrısı başarılı olduğunda ana ekrana yönlendir
      navigation.replace('MainTabs');
    } catch (error) {
      let errorMessage = 'Giriş yapılırken bir hata oluştu.';
      
      if (error.response) {
        // API'den gelen hata mesajı
        if (error.response.status === 401) {
          errorMessage = 'E-posta veya şifre hatalı.';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Hata', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.logoContainer}>
            <Icon name="bank" size={80} color="#007AFF" />
            <Text style={styles.appName}>Fino</Text>
            <Text style={styles.appSlogan}>Finansal Özgürlüğünüz</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Icon name="email-outline" size={24} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="E-posta"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock-outline" size={24} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Şifre"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#999"
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <Icon
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.forgotPassword}
              disabled={isLoading}
            >
              <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={passLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Giriş Yap</Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>veya</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => navigation.navigate('Register')}
              disabled={isLoading}
            >
              <Text style={styles.registerButtonText}>Yeni Hesap Oluştur</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 16,
  },
  appSlogan: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: 56,
    padding: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  passwordToggle: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    color: '#666',
    paddingHorizontal: 16,
  },
  registerButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  registerButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen; 