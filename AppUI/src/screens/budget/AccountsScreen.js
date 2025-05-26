import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { AccountStyles as styles, colors } from '../../styles/AccountStyles';
import { useFocusEffect } from '@react-navigation/native';

const AccountsScreen = ({ navigation }) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      fetchAccounts();
    }, [])
  );

  const updateAccountBalance = async (account, newBalance) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Hata', 'Kullanıcı bilgileri alınamadı');
        return;
      }

      const updateData = {
        id: account.accountId,
        userId: parseInt(userId),
        bankId: account.bankId,
        accountNo: account.iban,
        currencyId: account.currencyId,
        balance: newBalance,
        name: account.accountName
      };

      const response = await api.post('/BankAccount/update', updateData);
      if (response.data.success) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Hesap bakiyesi güncellenirken hata:', error);
      return false;
    }
  };

  const calculateAccountBalance = (transactions) => {
    return transactions.reduce((balance, transaction) => {
      if (transaction.transactionType === 'Gelir') {
        return balance + parseFloat(transaction.amount);
      } else if (transaction.transactionType === 'Gider') {
        return balance - parseFloat(transaction.amount);
      } else {
        // Debit işlemlerini bakiyeden düşme!
        return balance;
      }
    }, 0);
  };

  const fetchAccounts = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Hata', 'Kullanıcı bilgileri alınamadı');
        return;
      }

      // Hesapları getir
      const accountsResponse = await api.get(`/BankAccount/getdetailbyuserid?userId=${userId}`);
      if (!accountsResponse.data.success || !accountsResponse.data.data) {
        throw new Error('Hesap bilgileri alınamadı');
      }

      // Tüm işlemleri getir
      const transactionsResponse = await api.get(`/BankTransaction/getdetail?userId=${userId}`);
      if (!transactionsResponse.data.success || !transactionsResponse.data.data) {
        throw new Error('İşlem bilgileri alınamadı');
      }

      const allTransactions = transactionsResponse.data.data;
      const updatedAccounts = await Promise.all(
        accountsResponse.data.data.map(async (account) => {
          // Hesaba ait işlemleri filtrele
          const accountTransactions = allTransactions.filter(
            transaction => transaction.accountId === account.accountId
          );

          // Yeni bakiyeyi hesapla (sadece görüntüleme için)
          const calculatedBalance = calculateAccountBalance(accountTransactions);

          // Bakiyeyi otomatik güncelleme - KALDIRILDI
          // Artık sadece transaction ekleme sırasında güncelleniyor
          
          return account; // Değişiklik yapmadan geri dön
        })
      );

      setAccounts(updatedAccounts);
    } catch (error) {
      console.error('Hesap bilgileri alınamadı:', error);
      Alert.alert('Hata', 'Hesap bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const formatBalance = (balance) => {
    return parseFloat(balance).toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatIBAN = (iban) => {
    if (!iban) return '';
    return iban.replace(/(.{4})/g, '$1 ').trim();
  };

  const groupAccountsByBank = () => {
    const groupedAccounts = {};
    accounts.forEach(account => {
      if (!groupedAccounts[account.bankName]) {
        groupedAccounts[account.bankName] = [];
      }
      groupedAccounts[account.bankName].push(account);
    });
    return groupedAccounts;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const groupedAccounts = groupAccountsByBank();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Hesaplarım</Text>
            <Text style={styles.subtitle}>Tüm hesaplarınızı yönetin</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('AddAccount')}
          >
            <Icon name="plus" size={28} color={colors.white} style={styles.addButtonIcon} />
          </TouchableOpacity>
        </View>

      {accounts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Icon name="bank-off" size={40} color={colors.text.secondary} />
          </View>
          <Text style={styles.emptyTitle}>Henüz hesabınız yok</Text>
          <Text style={styles.emptyText}>İlk hesabınızı ekleyerek başlayın ve finansal durumunuzu takip edin</Text>
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={() => navigation.navigate('AddAccount')}
          >
            <Icon name="plus" size={20} color={colors.white} />
            <Text style={styles.emptyButtonText}>Hesap Ekle</Text>
          </TouchableOpacity>
        </View>
      ) : (
        Object.entries(groupedAccounts).map(([bankName, bankAccounts]) => (
          <View key={bankName} style={styles.bankSection}>
            <View style={styles.bankHeader}>
              <View style={styles.bankIconContainer}>
                <Icon name="bank" size={24} color={colors.account.primary} />
              </View>
              <View>
                <Text style={styles.bankTitle}>{bankName}</Text>
                <Text style={styles.bankAccountCount}>{bankAccounts.length} hesap</Text>
              </View>
            </View>
            <View style={styles.accountsGrid}>
              {bankAccounts.map((account) => (
                <TouchableOpacity
                  key={account.accountId}
                  style={styles.accountContainer}
                  onPress={() => navigation.navigate('AccountDetail', { account })}
                >
                  <View style={styles.accountGlow} />
                  <View style={styles.accountHeader}>
                    <View style={styles.accountTypeIcon}>
                      <Icon name="credit-card" size={20} color={colors.account.primary} />
                    </View>
                    <View style={styles.currencyContainer}>
                      <Text style={styles.currencyText}>{account.currencyName}</Text>
                    </View>
                  </View>

                  <View style={styles.accountBody}>
                    <Text style={styles.balanceLabel}>Bakiye</Text>
                    <Text style={styles.balance}>
                      {formatBalance(account.balance)}
                    </Text>
                    <Text style={styles.accountName}>{account.accountName}</Text>
                    <View style={styles.ibanContainer}>
                      <Text style={styles.ibanLabel}>IBAN</Text>
                      <Text style={styles.ibanValue}>{formatIBAN(account.iban)}</Text>
                    </View>
                    <View style={styles.performanceContainer}>
                      <Icon name="trending-up" size={16} color={colors.success} style={styles.performanceIcon} />
                      <Text style={styles.performanceText}>Aktif</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))
      )}
      </ScrollView>
    </View>
  );
};

export default AccountsScreen; 