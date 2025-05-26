import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PersonalInfoScreen = ({ navigation, route }) => {
  const { userData: initialUserData } = route.params;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: initialUserData?.firstName || '',
    lastName: initialUserData?.lastName || '',
    email: initialUserData?.mail || '',
    phone: initialUserData?.phone || '',
    address: initialUserData?.address || '',
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      
      const response = await api.put(`/User/update?userId=${userId}`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        mail: formData.email,
        phone: formData.phone,
        address: formData.address,
      });

      if (response.data.success) {
        Alert.alert('Başarılı', 'Bilgileriniz başarıyla güncellendi');
        navigation.goBack();
      } else {
        Alert.alert('Hata', 'Bilgileriniz güncellenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      Alert.alert('Hata', 'Bilgileriniz güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label, value, onChangeText, placeholder, keyboardType = 'default') => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor="#999"
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#2196F3', '#1976D2']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kişisel Bilgiler</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {renderInput(
          'Ad',
          formData.firstName,
          (text) => setFormData({ ...formData, firstName: text }),
          'Adınızı girin'
        )}
        {renderInput(
          'Soyad',
          formData.lastName,
          (text) => setFormData({ ...formData, lastName: text }),
          'Soyadınızı girin'
        )}
        {renderInput(
          'E-posta',
          formData.email,
          (text) => setFormData({ ...formData, email: text }),
          'E-posta adresinizi girin',
          'email-address'
        )}
        {renderInput(
          'Telefon',
          formData.phone,
          (text) => setFormData({ ...formData, phone: text }),
          'Telefon numaranızı girin',
          'phone-pad'
        )}
        {renderInput(
          'Adres',
          formData.address,
          (text) => setFormData({ ...formData, address: text }),
          'Adresinizi girin'
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Icon name="content-save" size={24} color="#FFF" />
              <Text style={styles.saveButtonText}>Kaydet</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default PersonalInfoScreen;