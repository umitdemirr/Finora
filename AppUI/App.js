import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Animated, ActivityIndicator, Alert
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={homeStyles.container}>
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        style={homeStyles.menuButton}
      >
        {/* <Text style={homeStyles.menuText}>☰</Text> */}
      </TouchableOpacity>

      <Text style={homeStyles.welcome}>Ana Sayfaya Hoş Geldiniz!</Text>
      <Text style={homeStyles.subtitle}>Finanslarınızı kontrol altında tutun 💸</Text>

      <TouchableOpacity
        style={homeStyles.button}
        onPress={() => navigation.navigate('Profil')}
      >
        <Text style={homeStyles.buttonText}>Profilime Git</Text>
      </TouchableOpacity>
    </View>
  );
}
function ProfileScreen() {
  return (
    <View style={homeStyles.container}>
      <Text style={homeStyles.welcome}>Profil Sayfası</Text>
      <Text style={homeStyles.subtitle}>Buraya kullanıcı bilgileri gelebilir.</Text>
    </View>
  );
}
function BankAccountsScreen() {
  return (
    <View style={homeStyles.container}>
      <Text style={homeStyles.welcome}>Banka Hesaplarım</Text>
      <Text style={homeStyles.subtitle}>Burada banka hesaplarını görebilirsin.</Text>
    </View>
  );
}
function CardsScreen() {
  return (
    <View style={homeStyles.container}>
      <Text style={homeStyles.welcome}>Kartlar</Text>
      <Text style={homeStyles.subtitle}>Tüm kart bilgilerin burada.</Text>
    </View>
  );
}
function TransactionsScreen() {
  return (
    <View style={homeStyles.container}>
      <Text style={homeStyles.welcome}>İşlemler</Text>
      <Text style={homeStyles.subtitle}>Geçmiş işlemlerini buradan takip edebilirsin.</Text>
    </View>
  );
}
function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Uyarı', 'Lütfen e-posta ve şifre girin.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        'https://26v20qzz-44324.euw.devtunnels.ms/api/Auth/login',
        { email, password },
        { headers: { 'Content-Type': 'application/json', 'accept': '*/*' } }
      );

      if (response.status === 200) {
        Alert.alert('Başarılı', 'Giriş başarılı!');
        navigation.replace('Main');
      } else {
        Alert.alert('Hata', 'Beklenmeyen bir yanıt alındı');
      }

    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data?.message || error.response.data?.title || 'Giriş başarısız';
        Alert.alert('Hata', errorMessage);
      } else if (error.request) {
        Alert.alert('Hata', 'Sunucuya bağlanılamadı');
      } else {
        Alert.alert('Hata', 'Bir hata oluştu: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="auto" />

      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.appName}>Finora</Text>
        <Text style={styles.welcomeText}>Hoş Geldiniz</Text>
      </Animated.View>

      <Animated.View style={[styles.formContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Şifre"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Giriş Yap</Text>}
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const DrawerHeader = (props) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>{props.title}</Text>
    </View>
  );
};

function MainDrawer() {
  return (

    <Drawer.Navigator initialRouteName="Ana Sayfa">
      <Drawer.Screen name="Ana Sayfa" component={HomeScreen} />
      <Drawer.Screen name="Profil" component={ProfileScreen} />
      <Drawer.Screen name="Banka Hesaplarım" component={BankAccountsScreen} />
      <Drawer.Screen name="Kartlar" component={CardsScreen} />
      <Drawer.Screen name="İşlemler" component={TransactionsScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainDrawer} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
// === STYLES ===

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  logoContainer: { alignItems: 'center', marginTop: 60, marginBottom: 40 },
  appName: { fontSize: 32, fontWeight: 'bold', color: '#2C3E50', marginBottom: 10 },
  welcomeText: { fontSize: 18, color: '#7F8C8D' },
  formContainer: { paddingHorizontal: 30 },
  input: {
    height: 50, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 25,
    paddingHorizontal: 20, marginBottom: 15, fontSize: 16, backgroundColor: '#F8F9FA',
  },
  button: {
    height: 50, backgroundColor: '#3498DB', borderRadius: 25,
    justifyContent: 'center', alignItems: 'center', marginTop: 20,
  },
  buttonDisabled: { backgroundColor: '#BDC3C7' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
const homeStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA', padding: 20, justifyContent: 'center', alignItems: 'center' },
  menuButton: { position: 'absolute', top: 50, left: 20 },
  menuText: { fontSize: 28, fontWeight: 'bold', color: '#4F46E5' },
  welcome: { fontSize: 24, fontWeight: 'bold', color: '#2E3A59', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 30, textAlign: 'center' },
  button: { backgroundColor: '#4F46E5', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});