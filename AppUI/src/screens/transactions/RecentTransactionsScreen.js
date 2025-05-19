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
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { Picker } from '@react-native-picker/picker';

export const handleAddTransaction = async (newTransaction, setModalVisible, setNewTransaction, fetchTransactions, account) => {
  try {
    if (!newTransaction.amount || !newTransaction.description) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    // Tutarı her zaman pozitif olarak gönder
    const amount = Math.abs(parseFloat(newTransaction.amount));

    const response = await api.post('/BankTransaction/add', {
      ...newTransaction,
      amount: amount,
      transactionType: newTransaction.transactionType // İşlem tipini transactionType olarak gönder
    });

    if (response.data.success) {
      Alert.alert('Başarılı', 'İşlem başarıyla eklendi');
      setModalVisible(false);
      setNewTransaction({
        accountId: account.accountId,
        category: 'Havale',
        transactionType: 'Gelir',
        paymentType: 'Banka Hesabı',
        amount: '',
        currency: account.currencyName,
        description: '',
        date: new Date().toISOString(),
      });
      fetchTransactions();
    } else {
      Alert.alert('Hata', 'İşlem eklenirken bir hata oluştu');
    }
  } catch (error) {
    console.error('İşlem eklenemedi:', error);
    Alert.alert('Hata', 'İşlem eklenirken bir hata oluştu');
  }
};

const RecentTransactionsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    accountId: '',
    category: '',
    transactionType: '',
    paymentType: '',
    amount: '',
    currency: '',
    description: '',
    date: new Date().toISOString(),
  });

  const transactionCategories = [
    'Havale',
    'EFT',
    'Kredi Kartı',
    'Nakit',
    'Diğer'
  ];

  const currencies = [
    { code: 'TRY', symbol: '₺' },
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' }
  ];

  const filters = [
    { id: 'all', label: 'Tümü' },
    { id: 'income', label: 'Gelirler' },
    { id: 'expense', label: 'Giderler' },
  ];

  useEffect(() => {
    fetchTransactions();
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
        // İlk hesabı varsayılan olarak seç
        if (response.data.data.length > 0) {
          setNewTransaction(prev => ({
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

  const fetchTransactions = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Hata', 'Kullanıcı bilgileri alınamadı');
        return;
      }

      const response = await api.get(`/BankTransaction/getdetail?userId=${userId}`);
      if (response.data.success && response.data.data) {
        // API'den gelen verileri işle ve tutarları işlem tipine göre düzenle
        const processedTransactions = response.data.data.map(transaction => ({
          ...transaction,
          // İşlem tipine göre tutarı düzenle
          displayAmount: transaction.transactionType === 'Gider' ? -Math.abs(transaction.amount) : Math.abs(transaction.amount)
        }));
        setTransactions(processedTransactions);
      }
    } catch (error) {
      console.error('İşlem bilgileri alınamadı:', error);
      Alert.alert('Hata', 'İşlem bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransactionLocal = () => {
    handleAddTransaction(newTransaction, setModalVisible, setNewTransaction, fetchTransactions, accounts[0]);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'income') return transaction.transactionType === 'Gelir';
    if (selectedFilter === 'expense') return transaction.transactionType === 'Gider';
    return true;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatAmount = (amount) => {
    return parseFloat(amount).toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Üst Bilgi Kartı */}
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>Son İşlemler</Text>
        <Text style={styles.headerSubtitle}>
          {filteredTransactions.length} işlem bulundu
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Filtre Seçici */}
      <View style={styles.filterSelector}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              selectedFilter === filter.id && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === filter.id && styles.filterButtonTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Arama Çubuğu */}
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="İşlem ara..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* İşlem Listesi */}
      <ScrollView style={styles.transactionsList}>
        {filteredTransactions.map((transaction) => (
          <TouchableOpacity
            key={transaction.bankTransactionId}
            style={styles.transactionItem}
            onPress={() => {
              Alert.alert(
                transaction.description,
                `Tutar: ${formatAmount(Math.abs(transaction.amount))} ${transaction.currency}\n
                Tarih: ${formatDate(transaction.transactionDate)}\n
                Hesap: ${transaction.accountName}\n
                İşlem Tipi: ${transaction.transactionType}\n
                Kategori: ${transaction.type}
                `,
                [
                  {
                    text: 'Düzenle',
                    onPress: () => {
                      Alert.alert('Bilgi', 'Düzenleme özelliği yakında eklenecek.');
                    },
                  },
                  {
                    text: 'Kapat',
                    style: 'cancel',
                  },
                ]
              );
            }}
          >
            <View style={styles.transactionLeft}>
              <View
                style={[
                  styles.transactionIcon,
                  { backgroundColor: transaction.transactionType === 'Gelir' ? '#4CAF5020' : '#F4433620' },
                ]}
              >
                <Icon
                  name={transaction.transactionType === 'Gelir' ? 'arrow-up' : 'arrow-down'}
                  size={24}
                  color={transaction.transactionType === 'Gelir' ? '#4CAF50' : '#F44336'}
                />
              </View>
              <View style={styles.accountInfo}>
                <Text style={styles.accountName}>{transaction.accountName}</Text>
                <View style={[
                  styles.typeLabel,
                  { backgroundColor: transaction.transactionType === 'Gelir' ? '#4CAF5020' : '#F4433620' }
                ]}>
                  <Text style={[
                    styles.typeLabelText,
                    { color: transaction.transactionType === 'Gelir' ? '#4CAF50' : '#F44336' }
                  ]}>
                    {transaction.transactionType}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.transactionCenter}>
              <Text style={styles.transactionTitle}>{transaction.description}</Text>
              <Text style={styles.transactionDate}>{formatDate(transaction.transactionDate)}</Text>
            </View>

            <Text
              style={[
                styles.transactionAmount,
                {
                  color: transaction.transactionType === 'Gelir' ? '#4CAF50' : '#F44336',
                },
              ]}
            >
              {transaction.transactionType === 'Gelir' ? '+' : '-'}{formatAmount(Math.abs(transaction.amount))} {transaction.currency}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* İşlem Ekleme Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Yeni İşlem Ekle</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Hesap</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={newTransaction.accountId}
                    onValueChange={(value) =>
                      setNewTransaction({ ...newTransaction, accountId: value })
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
                <Text style={styles.inputLabel}>Açıklama</Text>
                <TextInput
                  style={styles.input}
                  value={newTransaction.description}
                  onChangeText={(text) =>
                    setNewTransaction({ ...newTransaction, description: text })
                  }
                  placeholder="İşlem açıklaması"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Tutar</Text>
                <TextInput
                  style={styles.input}
                  value={newTransaction.amount}
                  onChangeText={(text) =>
                    setNewTransaction({ ...newTransaction, amount: text })
                  }
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Para Birimi</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={newTransaction.currency}
                    onValueChange={(value) =>
                      setNewTransaction({ ...newTransaction, currency: value })
                    }
                    style={styles.picker}
                  >
                    {currencies.map((currency) => (
                      <Picker.Item
                        key={currency.code}
                        label={`${currency.code} (${currency.symbol})`}
                        value={currency.code}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Kategori</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={newTransaction.category}
                    onValueChange={(value) =>
                      setNewTransaction({ ...newTransaction, category: value })
                    }
                    style={styles.picker}
                  >
                    {transactionCategories.map((category) => (
                      <Picker.Item
                        key={category}
                        label={category}
                        value={category}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>İşlem Tipi</Text>
                <View style={styles.typeSelector}>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      newTransaction.transactionType === 'Gelir' &&
                        styles.typeButtonActive,
                    ]}
                    onPress={() =>
                      setNewTransaction({
                        ...newTransaction,
                        transactionType: 'Gelir',
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        newTransaction.transactionType === 'Gelir' &&
                          styles.typeButtonTextActive,
                      ]}
                    >
                      Gelir
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      newTransaction.transactionType === 'Gider' &&
                        styles.typeButtonActive,
                    ]}
                    onPress={() =>
                      setNewTransaction({
                        ...newTransaction,
                        transactionType: 'Gider',
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        newTransaction.transactionType === 'Gider' &&
                          styles.typeButtonTextActive,
                      ]}
                    >
                      Gider
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddTransactionLocal}
              >
                <Text style={styles.submitButtonText}>İşlemi Ekle</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.8,
    marginTop: 5,
  },
  filterSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF',
    marginTop: -10,
    marginHorizontal: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  filterButtonActive: {
    backgroundColor: '#2196F3',
  },
  filterButtonText: {
    color: '#666',
    fontSize: 14,
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
  },
  transactionsList: {
    flex: 1,
    padding: 15,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '25%',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  accountInfo: {
    flex: 1,
    marginLeft: 8,
  },
  accountName: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  transactionCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    width: '25%',
    textAlign: 'right',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    maxHeight: '100%',
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
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 5,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  typeButtonActive: {
    backgroundColor: '#2196F3',
  },
  typeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickerContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  typeLabel: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  typeLabelText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default RecentTransactionsScreen;