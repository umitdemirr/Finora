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
import { AddCreditCardStyles as styles } from '../../styles/globalStyles';

const AddCreditCardScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState([]);
  const [newCard, setNewCard] = useState({
    bankId: '',
    name: '',
    provider: 'VISA',
    number: '',
    expiryDate: '',
    cvv: '',
    limit: '',
    avaliableLimit: '',
    statementClosingDate: '',
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
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Hata', 'Kullanıcı bilgileri alınamadı');
        return;
      }

      // Kullanıcının hesaplarını çek
      const response = await api.get(`/BankAccount/getdetailbyuserid?userId=${userId}`);
      
      if (response.data.success && response.data.data) {
        const userAccounts = response.data.data;
        
        // Her hesap için banka bilgisi oluştur (hesap adıyla birlikte)
        const banksWithAccounts = userAccounts.map(account => ({
          id: account.bankId,
          name: account.bankName,
          accountName: account.accountName,
          accountId: account.accountId,
          displayName: `${account.bankName} - ${account.accountName}`
        }));
        
        setBanks(banksWithAccounts);
        
        // İlk hesabın bankasını otomatik seç
        if (banksWithAccounts.length > 0) {
          setNewCard(prev => ({
            ...prev,
            bankId: banksWithAccounts[0].id
          }));
        }
      }
    } catch (error) {
      console.error('ERROR - Could not fetch user accounts:', error);
      Alert.alert('Hata', 'Hesap bilgileri yüklenirken bir hata oluştu');
    }
  };

  const handleAddCard = async () => {
    try {

      if (!newCard.name || !newCard.number || !newCard.expiryDate || !newCard.cvv || !newCard.bankId || !newCard.limit || !newCard.statementClosingDate) {
        Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
        return;
      }

      // Ekstre kesim tarihi kontrolü
      const closingDate = parseInt(newCard.statementClosingDate);
      if (isNaN(closingDate) || closingDate < 1 || closingDate > 31) {
        Alert.alert('Hata', 'Ekstre kesim tarihi 1-31 arasında olmalıdır');
        return;
      }

      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');

      const requestData = {
        id: 0,
        userId: parseInt(userId),
        bankId: parseInt(newCard.bankId),
        name: newCard.name,
        provider: newCard.provider,
        number: newCard.number,
        expiryDate: newCard.expiryDate,
        cvv: newCard.cvv,
        limit: parseFloat(newCard.limit),
        avaliableLimit: parseFloat(newCard.limit),
        statementClosingDate: closingDate,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const response = await api.post('/CreditCard/add', requestData);
      if (response.data.success) {
        Alert.alert('Başarılı', 'Kredi kartı başarıyla eklendi');
        navigation.goBack();
      } else {
        Alert.alert('Hata', response.data.message || 'Kredi kartı eklenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('ERROR - Credit card addition failed:');
      console.error('Error Object:', error);
      console.error('Error Message:', error.message);
      console.error('Error Response:', error.response?.data);
      console.error('Error Status:', error.response?.status);
      console.error('Error Stack:', error.stack);
      
      Alert.alert('Hata', `Kredi kartı eklenirken bir hata oluştu: ${error.message}`);
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
        <Text style={styles.title}>Yeni Kredi Kartı Ekle</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Banka</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={newCard.bankId}
              onValueChange={(value) => {
                setNewCard({ ...newCard, bankId: value });
              }}
              style={styles.picker}
            >
              <Picker.Item label="Banka Seçiniz" value="" />
              {banks.map((bank) => (
                <Picker.Item
                  key={`${bank.id}-${bank.accountId}`}
                  label={bank.displayName}
                  value={bank.id}
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
            onChangeText={(text) => {
              setNewCard({ ...newCard, name: text });
            }}
            placeholder="Örn: Ziraat Kredi Kartı"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Kart Tipi</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={newCard.provider}
              onValueChange={(value) => {
                setNewCard({ ...newCard, provider: value });
              }}
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
            onChangeText={(text) => {
              setNewCard({ ...newCard, number: text });
            }}
            placeholder="1234567890123456"
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
              onChangeText={(text) => {
                setNewCard({ ...newCard, expiryDate: text });
              }}
              placeholder="MM/YY"
              maxLength={5}
            />
          </View>

          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={styles.inputLabel}>CVV</Text>
            <TextInput
              style={styles.input}
              value={newCard.cvv}
              onChangeText={(text) => {
                setNewCard({ ...newCard, cvv: text });
              }}
              placeholder="123"
              keyboardType="numeric"
              maxLength={3}
              secureTextEntry
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Kart Limiti</Text>
          <TextInput
            style={styles.input}
            value={newCard.limit}
            onChangeText={(text) => {
              setNewCard({ ...newCard, limit: text });
            }}
            placeholder="10000"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Ekstre Kesim Tarihi</Text>
          <TextInput
            style={styles.input}
            value={newCard.statementClosingDate}
            onChangeText={(text) => {
              setNewCard({ ...newCard, statementClosingDate: text });
            }}
            placeholder="1-31 arası bir gün"
            keyboardType="numeric"
            maxLength={2}
          />
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleAddCard}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Kredi Kartını Ekle</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddCreditCardScreen; 