import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert, Switch, ScrollView } from 'react-native'; // <-- Buraya ScrollView eklendi
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api';

const SettingsScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Hata', 'Kullanıcı bilgileri alınamadı');
        return;
      }

      const response = await api.get(`/User/getdetail?userId=${userId}`);
      if (response.data.success && response.data.data.length > 0) {
        setUserData(response.data.data[0]);
      }
    } catch (error) {
      console.error('Kullanıcı bilgileri alınamadı:', error);
      Alert.alert('Hata', 'Kullanıcı bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/Auth/logout');
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('tokenExpiration');
      navigation.replace('Login');
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
      Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const settingsSections = [
    {
      title: 'Hesap',
      options: [
        {
          id: 'personal',
          title: 'Kişisel Bilgiler',
          icon: 'account',
          onPress: () => navigation.navigate('PersonalInfo', { userData })
        },
        {
          id: 'password',
          title: 'Şifre Değiştir',
          icon: 'lock',
          onPress: () => navigation.navigate('ChangePassword')
        },
        {
          id: 'email',
          title: 'E-posta Değiştir',
          icon: 'email',
          onPress: () => navigation.navigate('ChangeEmail')
        }
      ]
    },
    {
      title: 'Uygulama',
      options: [
        {
          id: 'theme',
          title: 'Koyu Tema',
          icon: 'theme-light-dark',
          type: 'switch',
          value: darkMode,
          onValueChange: setDarkMode
        },
        {
          id: 'notifications',
          title: 'Bildirimler',
          icon: 'bell',
          type: 'switch',
          value: notifications,
          onValueChange: setNotifications
        },
        {
          id: 'language',
          title: 'Dil',
          icon: 'translate',
          value: 'Türkçe',
          onPress: () => navigation.navigate('Language')
        },
        {
          id: 'currency',
          title: 'Para Birimi',
          icon: 'currency-usd',
          value: 'TRY',
          onPress: () => navigation.navigate('Currency')
        }
      ]
    },
    {
      title: 'Hakkında',
      options: [
        {
          id: 'privacy',
          title: 'Gizlilik Politikası',
          icon: 'shield-account',
          onPress: () => navigation.navigate('PrivacyPolicy')
        },
        {
          id: 'terms',
          title: 'Kullanım Koşulları',
          icon: 'file-document',
          onPress: () => navigation.navigate('Terms')
        },
        {
          id: 'about',
          title: 'Uygulama Hakkında',
          icon: 'information',
          onPress: () => navigation.navigate('About')
        }
      ]
    }
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2196F3', '#1976D2']}
        style={styles.header}
      >
        <View style={styles.profileImageContainer}>
          <Image
            style={styles.profileImage}
            source={{ uri: 'https://via.placeholder.com/100' }}
          />
        </View>
        <Text style={styles.name}>{userData?.firstName} {userData?.lastName}</Text>
        <Text style={styles.email}>{userData?.mail}</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {settingsSections.map((section, index) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.options.map((option) => (
                <TouchableOpacity 
                  key={option.id} 
                  style={styles.option}
                  onPress={option.onPress}
                  disabled={option.type === 'switch'}
                >
                  <View style={styles.optionLeft}>
                    <View style={styles.iconContainer}>
                      <Icon name={option.icon} size={24} color="#2196F3" />
                    </View>
                    <Text style={styles.optionTitle}>{option.title}</Text>
                  </View>
                  {option.type === 'switch' ? (
                    <Switch
                      value={option.value}
                      onValueChange={option.onValueChange}
                      trackColor={{ false: '#767577', true: '#81b0ff' }}
                      thumbColor={option.value ? '#2196F3' : '#f4f3f4'}
                    />
                  ) : option.value ? (
                    <View style={styles.optionRight}>
                      <Text style={styles.optionValue}>{option.value}</Text>
                      <Icon name="chevron-right" size={24} color="#666" />
                    </View>
                  ) : (
                    <Icon name="chevron-right" size={24} color="#666" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={24} color="#FF3B30" />
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 30,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    padding: 3,
    marginBottom: 16,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginLeft: 16,
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionValue: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF3B30',
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default SettingsScreen;