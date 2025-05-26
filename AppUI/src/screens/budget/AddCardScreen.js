import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { Picker } from '@react-native-picker/picker';
import { AddCardStyles as styles } from '../../styles/globalStyles';

const AddCardScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [newCard, setNewCard] = useState({
    accountId: '',
    name: '',
    provider: 'VISA',
    number: '',
    expiryDate: '',
    cvv: '',
    isActive: true,
  });

  const cardProviders = [
    { id: 'VISA', name: 'Visa' },
    { id: 'MASTERCARD', name: 'Mastercard' },
    { id: 'AMERICAN EXPRESS', name: 'American Express' },
    { id: 'TROY', name: 'Troy' },
    { id: 'BKM EXPRESS', name: 'BKM Express' },

  ];

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Hata', 'Kullanıcı bilgileri alınamadı');
        return;
      }

      const response = await api.get(`/BankAccount/getdetailbyuserid?userId=${userId}`);
      if (response.data.success && response.data.data) {
        setAccounts(response.data.data);
        if (response.data.data.length > 0) {
          setNewCard(prev => ({
            ...prev,
            accountId: response.data.data[0].accountId
          }));
        }
      }
    } catch (error) {
      console.error('Hesap bilgileri alınamadı:', error);
      Alert.alert('Hata', 'Hesap bilgileri yüklenirken bir hata oluştu');
    }
  };

  const handleAddCard = async () => {
    try {
      if (!newCard.name || !newCard.number || !newCard.expiryDate || !newCard.cvv || !newCard.accountId) {
        Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
        return;
      }

      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      
      const response = await api.post('/BankCard/add', {
        ...newCard,
        userId: parseInt(userId),
        id: 0,
        createdAt: new Date().toISOString(),
      });

      if (response.data.success) {
        Alert.alert('Başarılı', 'Kart başarıyla eklendi');
        navigation.goBack();
      } else {
        Alert.alert('Hata', 'Kart eklenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Kart eklenemedi:', error);
      Alert.alert('Hata', 'Kart eklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Yeni Kart Ekle</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Hesap</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={newCard.accountId}
              onValueChange={(value) =>
                setNewCard({ ...newCard, accountId: value })
              }
              style={styles.picker}
            >
              {accounts.map((account) => (
                <Picker.Item
                  key={account.accountId}
                  label={`${account.accountName} (${account.bankName})`}
                  value={account.accountId}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Kart Adı</Text>
          <TextInput
            style={styles.input}
            value={newCard.name}
            onChangeText={(text) => setNewCard({ ...newCard, name: text })}
            placeholder="Örn: Kredi Kartım"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Kart Tipi</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={newCard.provider}
              onValueChange={(value) =>
                setNewCard({ ...newCard, provider: value })
              }
              style={styles.picker}
            >
              {cardProviders.map((provider) => (
                <Picker.Item
                  key={provider.id}
                  label={provider.name}
                  value={provider.id}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Kart Numarası</Text>
          <TextInput
            style={styles.input}
            value={newCard.number}
            onChangeText={(text) => setNewCard({ ...newCard, number: text })}
            placeholder="1234 5678 9012 3456"
            keyboardType="numeric"
            maxLength={16}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.inputLabel}>Son Kullanma Tarihi</Text>
            <TextInput
              style={styles.input}
              value={newCard.expiryDate}
              onChangeText={(text) => setNewCard({ ...newCard, expiryDate: text })}
              placeholder="MM/YY"
              maxLength={5}
            />
          </View>

          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={styles.inputLabel}>CVV</Text>
            <TextInput
              style={styles.input}
              value={newCard.cvv}
              onChangeText={(text) => setNewCard({ ...newCard, cvv: text })}
              placeholder="123"
              keyboardType="numeric"
              maxLength={3}
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleAddCard}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Kartı Ekle</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
export default AddCardScreen;