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
import api from '../../services/api';
import { LoginStyles as styles, colors } from '../../styles/LoginStyles';


const { height } = Dimensions.get('window');

// JWT token'dan user ID'yi çıkaran yardımcı fonksiyon
const getUserIdFromToken = (token) => {
  try {
    // Token'ın ikinci kısmını al (payload)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);
    // nameidentifier claim'inden user ID'yi al
    return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
  } catch (error) {
    console.error('Token decode hatası:', error);
    return null;
  }
};

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

      if (response.data && response.data.token) {
        const { token, expiration } = response.data;
        
        // Token'dan user ID'yi çıkar
        const userId = getUserIdFromToken(token);
        
        if (!userId) {
          throw new Error('Kullanıcı ID\'si alınamadı');
        }

        // Token ve kullanıcı ID'sini AsyncStorage'a kaydet
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('tokenExpiration', expiration);
        await AsyncStorage.setItem('userId', userId.toString());
        
        // API çağrısı başarılı olduğunda ana ekrana yönlendir
        navigation.replace('MainTabs');
      } else {
        Alert.alert('Hata', 'Geçersiz API yanıtı');
      }
    } catch (error) {
      let errorMessage = error.message;
       
      if (error.response) {
        // API'den gelen hata mesajı
        if (error.response.status === 400) { errorMessage = error.response.data; }
      } 
      else { errorMessage = error.message; } 
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
            <View style={styles.logo}>
              <Icon name="bank" size={70} color={colors.auth.primary} />
            </View>
            <Text style={styles.appName}>Finora</Text>
            <Text style={styles.appSlogan}>Finansal Özgürlüğünüz</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Icon name="email-outline" size={24} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="E-posta"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={colors.text.placeholder}
                  editable={!isLoading}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Icon name="lock-outline" size={24} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Şifre"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor={colors.text.placeholder}
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
                    color={colors.text.secondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.forgotPassword}
              disabled={isLoading}
            >
              <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
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

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Hesabınız yok mu?</Text>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => navigation.navigate('Register')}
                disabled={isLoading}
              >
                <Text style={styles.registerButtonText}>Kayıt Ol</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen; 