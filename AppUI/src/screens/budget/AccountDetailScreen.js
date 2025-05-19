import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { Picker } from '@react-native-picker/picker';
import { handleAddTransaction } from '../transactions/RecentTransactionsScreen';

const AccountDetailScreen = ({ route, navigation }) => {
  const { account } = route.params;
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });

  const [newTransaction, setNewTransaction] = useState({
    accountId: account.accountId,
    category: 'Havale',
    transactionType: 'Gelir',
    paymentType: 'Banka Hesabı',
    amount: '',
    currency: account.currencyName,
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

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Hata', 'Kullanıcı bilgileri alınamadı');
        return;
      }

      const response = await api.get(`/BankTransaction/getdetail?userId=${userId}`);
      if (response.data.success && response.data.data) {
        // Sadece seçili hesaba ait işlemleri filtrele
        const accountTransactions = response.data.data.filter(
          (transaction) => transaction.accountId === account.accountId
        );
        setTransactions(accountTransactions);

        // Özet bilgileri hesapla
        const summary = accountTransactions.reduce(
          (acc, transaction) => {
            if (transaction.amount > 0) {
              acc.totalIncome += transaction.amount;
            } else {
              acc.totalExpense += Math.abs(transaction.amount);
            }
            acc.balance += transaction.amount;
            return acc;
          },
          { totalIncome: 0, totalExpense: 0, balance: 0 }
        );
        setSummary(summary);
      }
    } catch (error) {
      console.error('İşlem bilgileri alınamadı:', error);
      Alert.alert('Hata', 'İşlem bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount) => {
    return parseFloat(amount).toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleAddTransactionLocal = () => {
    handleAddTransaction(newTransaction, setModalVisible, setNewTransaction, fetchTransactions, account);
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
      <ScrollView style={styles.scrollView}>
        {/* Hesap Bilgileri */}
        <View style={styles.accountHeader}>
          <View style={styles.accountInfo}>
            <Icon name="bank" size={24} color="#FFFFFF" />
            <Text style={styles.accountName}>{account.accountName}</Text>
            <Text style={styles.bankName}>{account.bankName}</Text>
          </View>
          <Text style={styles.balance}>
            {formatAmount(account.balance)} {account.currencyName}
          </Text>
        </View>

        {/* Özet Kartları */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Toplam Gelir</Text>
            <Text style={[styles.summaryAmount, styles.incomeText]}>
              {formatAmount(summary.totalIncome)} {account.currencyName}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Toplam Gider</Text>
            <Text style={[styles.summaryAmount, styles.expenseText]}>
              {formatAmount(summary.totalExpense)} {account.currencyName}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Bakiye</Text>
            <Text style={[styles.summaryAmount, styles.balanceText]}>
              {formatAmount(summary.balance)} {account.currencyName}
            </Text>
          </View>
        </View>

        {/* İşlem Listesi */}
        <View style={styles.transactionsContainer}>
          <Text style={styles.sectionTitle}>İşlem Geçmişi</Text>
          {transactions.map((transaction) => (
            <TouchableOpacity
              key={transaction.bankTransactionId}
              style={styles.transactionItem}
              onPress={() => {
                Alert.alert(
                  transaction.description,
                  `Tutar: ${formatAmount(transaction.amount)} ${transaction.currency}\nTarih: ${formatDate(transaction.transactionDate)}\nİşlem Tipi: ${transaction.type}`
                );
              }}
            >
              <View style={styles.transactionLeft}>
                <View
                  style={[
                    styles.transactionIcon,
                    {
                      backgroundColor:
                        transaction.amount > 0 ? '#4CAF5020' : '#F4433620',
                    },
                  ]}
                >
                  <Icon
                    name={transaction.amount > 0 ? 'arrow-down' : 'arrow-up'}
                    size={24}
                    color={transaction.amount > 0 ? '#4CAF50' : '#F44336'}
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>
                    {transaction.description}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {formatDate(transaction.transactionDate)}
                  </Text>
                  <Text style={styles.transactionType}>{transaction.type}</Text>
                </View>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  {
                    color: transaction.amount > 0 ? '#4CAF50' : '#F44336',
                  },
                ]}
              >
                {transaction.amount > 0 ? '+' : '-'}
                {formatAmount(Math.abs(transaction.amount))} {transaction.currency}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* İşlem Ekleme Butonu */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>

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
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountHeader: {
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  accountInfo: {
    alignItems: 'center',
    marginBottom: 10,
  },
  accountName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
  },
  bankName: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  balance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginTop: -20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  incomeText: {
    color: '#4CAF50',
  },
  expenseText: {
    color: '#F44336',
  },
  balanceText: {
    color: '#2196F3',
  },
  transactionsContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
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
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  transactionType: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
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
});

export default AccountDetailScreen; 