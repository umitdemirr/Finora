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

const AddAccountScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [newAccount, setNewAccount] = useState({
    name: '',
    accountNo: '',
    bankId: '',
    currencyId: '',
    balance: '',
  });

  useEffect(() => {
    fetchBanksAndCurrencies();
  }, []);

  const fetchBanksAndCurrencies = async () => {
    try {
      const [banksResponse, currenciesResponse] = await Promise.all([
        api.get('/BankAndExchange/getall'),
        api.get('/Currency/getall')
      ]);

      if (banksResponse.data.success) {
        setBanks(banksResponse.data.data.filter(bank => bank.type === 'Banka'));
      }

      if (currenciesResponse.data.success) {
        setCurrencies(currenciesResponse.data.data);
      }
    } catch (error) {
      console.error('Veri çekme hatası:', error);
      Alert.alert('Hata', 'Banka ve para birimi bilgileri alınamadı');
    }
  };

  const formatAccountNumber = (text) => {
    // Remove non-numeric characters
    const numbers = text.replace(/[^0-9]/g, '');
    
    // Add TR prefix
    let formatted = numbers;
    if (!formatted.startsWith('TR')) {
      formatted = 'TR' + formatted;
    }
    
    // Format in groups of 4 with last group of 2
    const groups = [];
    for (let i = 0; i < formatted.length; i += 4) {
      if (i === 20) { // Last 2 digits
        groups.push(formatted.slice(i, i + 2));
        break;
      }
      groups.push(formatted.slice(i, i + 4));
    }
    return groups.join('-');
  };

  const handleAccountNumberChange = (text) => {
    // Remove all non-numeric characters and TR prefix
    const numbers = text.replace(/[^0-9]/g, '');
    
    // Limit to 24 digits (TR + 22 digits)
    const limitedNumbers = numbers.slice(0, 22);
    
    // Format the number
    const formatted = formatAccountNumber(limitedNumbers);
    
    setNewAccount({ ...newAccount, accountNo: formatted });
  };

  const handleAddAccount = async () => {
    try {
      if (!newAccount.name || !newAccount.accountNo || !newAccount.bankId || !newAccount.currencyId) {
        Alert.alert('Hata', 'Lütfen tüm zorunlu alanları doldurun');
        return;
      }

      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Hata', 'Kullanıcı bilgileri alınamadı');
        return;
      }

      const accountData = {
        id: 0,
        userId: parseInt(userId),
        bankId: parseInt(newAccount.bankId),
        accountNo: newAccount.accountNo,
        currencyId: parseInt(newAccount.currencyId),
        balance: parseFloat(newAccount.balance) || 0,
        name: newAccount.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await api.post('/BankAccount/add', accountData);

      if (response.data.success) {
        Alert.alert('Başarılı', 'Hesap başarıyla eklendi');
        navigation.goBack();
      } else {
        Alert.alert('Hata', 'Hesap eklenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Hesap eklenemedi:', error);
      Alert.alert('Hata', 'Hesap eklenirken bir hata oluştu');
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
        <Text style={styles.title}>Yeni Hesap Ekle</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Hesap Adı</Text>
          <TextInput
            style={styles.input}
            value={newAccount.name}
            onChangeText={(text) => setNewAccount({ ...newAccount, name: text })}
            placeholder="Örn: Vadesiz TL Hesabı"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Banka</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={newAccount.bankId}
              onValueChange={(value) =>
                setNewAccount({ ...newAccount, bankId: value })
              }
              style={styles.picker}
            >
              <Picker.Item label="Banka Seçiniz" value="" />
              {banks.map((bank) => (
                <Picker.Item
                  key={bank.id}
                  label={bank.name}
                  value={bank.id.toString()}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Hesap Numarası</Text>
          <TextInput
            style={styles.input}
            value={newAccount.accountNo}
            onChangeText={handleAccountNumberChange}
            placeholder="TR12-3456-7891-2345-6789-12"
            autoCapitalize="characters"
            maxLength={27} // TR + 5 groups of 4 digits + 1 group of 2 digits + 5 hyphens
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Para Birimi</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={newAccount.currencyId}
              onValueChange={(value) =>
                setNewAccount({ ...newAccount, currencyId: value })
              }
              style={styles.picker}
            >
              <Picker.Item label="Para Birimi Seçiniz" value="" />
              {currencies.map((currency) => (
                <Picker.Item
                  key={currency.id}
                  label={currency.code}
                  value={currency.id.toString()}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Bakiye</Text>
          <TextInput
            style={styles.input}
            value={newAccount.balance}
            onChangeText={(text) => setNewAccount({ ...newAccount, balance: text })}
            placeholder="0.00"
            keyboardType="decimal-pad"
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleAddAccount}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Hesap Ekle</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddAccountScreen;
