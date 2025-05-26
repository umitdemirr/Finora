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
import { AccountDetailStyles as styles, colors } from '../../styles/accountDetailStyles';

const AccountDetailScreen = ({ route, navigation }) => {
  const { account } = route.params;
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [totalDebt, setTotalDebt] = useState(0);
  const [accountCards, setAccountCards] = useState([]);
  const [accountCreditCards, setAccountCreditCards] = useState([]);

  useEffect(() => {
    fetchTransactions();
    fetchAccountCards();
    fetchAccountCreditCards();
  }, []);

  const fetchAccountCreditCards = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Hata', 'Kullanıcı bilgileri alınamadı');
        return;
      }

      const response = await api.get(`/CreditCard/getdetail?userId=${userId}`);

      if (response.data.success && response.data.data) {
        const allCreditCards = response.data.data;
        // Seçilen hesabın accountId'si ile eşleşen kredi kartlarını filtrele
        const matchingCreditCards = allCreditCards.filter(card => 
          card.accountId === account.accountId || 
          card.accountId === account.id ||
          String(card.accountId) === String(account.accountId) ||
          Number(card.accountId) === Number(account.accountId)
        );
        setAccountCreditCards(matchingCreditCards);
      }
    } catch (error) {
      console.error('Kredi kartı bilgileri alınamadı:', error);
      // Hata durumunda kullanıcıyı uyarmayalım, sadece kartları göstermeyelim
    }
  };

  const fetchAccountCards = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Hata', 'Kullanıcı bilgileri alınamadı');
        return;
      }

      const response = await api.get(`/BankCard/getdetail?userId=${userId}`);

      if (response.data.success && response.data.data) {
        const allCards = response.data.data;
        // Seçilen hesabın accountId'si ile eşleşen kartları filtrele
        const matchingCards = allCards.filter(card => 
          card.accountId === account.accountId || 
          card.accountId === account.id ||
          String(card.accountId) === String(account.accountId) ||
          Number(card.accountId) === Number(account.accountId)
        );
        setAccountCards(matchingCards);
      }
    } catch (error) {
      console.error('Kart bilgileri alınamadı:', error);
      // Hata durumunda kullanıcıyı uyarmayalım, sadece kartları göstermeyelim
    }
  };

  const fetchTransactions = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Hata', 'Kullanıcı bilgileri alınamadı');
        return;
      }

      // Önce kartları al
      const [bankCardsResponse, creditCardsResponse, transactionsResponse] = await Promise.all([
        api.get(`/BankCard/getdetail?userId=${userId}`),
        api.get(`/CreditCard/getdetail?userId=${userId}`),
        api.get(`/BankTransaction/getdetail?userId=${userId}`)
      ]);

      if (transactionsResponse.data.success && transactionsResponse.data.data) {
        const allTransactions = transactionsResponse.data.data;
        
        // Bu hesaba ait banka kartlarının ID'lerini al
        let accountBankCardIds = [];
        if (bankCardsResponse.data.success && bankCardsResponse.data.data) {
          accountBankCardIds = bankCardsResponse.data.data
            .filter(card => 
              card.accountId === account.accountId || 
              card.accountId === account.id ||
              String(card.accountId) === String(account.accountId) ||
              Number(card.accountId) === Number(account.accountId)
            )
            .map(card => card.id);
        }

        // Bu hesaba ait kredi kartlarının ID'lerini al
        let accountCreditCardIds = [];
        if (creditCardsResponse.data.success && creditCardsResponse.data.data) {
          accountCreditCardIds = creditCardsResponse.data.data
            .filter(card => 
              card.accountId === account.accountId || 
              card.accountId === account.id ||
              String(card.accountId) === String(account.accountId) ||
              Number(card.accountId) === Number(account.accountId)
            )
            .map(card => card.id);
        }


        // İşlemleri filtrele - accountId alanı farklı türde ID'ler içeriyor
        const accountTransactions = allTransactions.filter(transaction => {
          // Gelir işlemleri: accountId = gerçek hesap ID'si
          if (transaction.transactionType === 'Gelir') {
            return transaction.accountId === account.accountId ||
                   transaction.accountId === account.id ||
                   String(transaction.accountId) === String(account.accountId) ||
                   Number(transaction.accountId) === Number(account.accountId);
          }
          
          // Gider işlemleri: accountId = banka kartı ID'si
          if (transaction.transactionType === 'Gider') {
            return accountBankCardIds.includes(transaction.accountId) ||
                   accountBankCardIds.includes(Number(transaction.accountId)) ||
                   accountBankCardIds.includes(String(transaction.accountId));
          }
          
          // Debit işlemleri (kredi kartı borçları): accountId = kredi kartı ID'si
          if (transaction.transactionType === 'Debit') {
            return accountCreditCardIds.includes(transaction.accountId) ||
                   accountCreditCardIds.includes(Number(transaction.accountId)) ||
                   accountCreditCardIds.includes(String(transaction.accountId));
          }
          
          return false;
        });
        
        setTransactions(accountTransactions);
        
        // Özet bilgileri hesapla
        const totalIncome = accountTransactions.filter(t => t.transactionType === 'Gelir').reduce((sum, t) => sum + Number(t.amount), 0);
        const totalExpense = accountTransactions.filter(t => t.transactionType === 'Gider').reduce((sum, t) => sum + Number(t.amount), 0);
        const balance = totalIncome - totalExpense;
        setSummary({ totalIncome, totalExpense, balance });
        
        // Toplam borcu hesapla (kredi kartı borçları)
        const debt = accountTransactions
          .filter(t => t.transactionType === 'Debit')
          .reduce((sum, t) => sum + Number(t.amount), 0);
        setTotalDebt(debt);
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

  const formatCurrency = (amount) => {
    if (isNaN(amount)) return '₺0,00';
    return '₺' + Number(amount).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
            {formatCurrency(account.balance)}
          </Text>
        </View>

        {/* Özet Kartları */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Hesap Gelirleri</Text>
            <Text style={[styles.summaryAmount, styles.incomeText]}>
              {formatCurrency(summary.totalIncome)}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Hesap Giderleri</Text>
            <Text style={[styles.summaryAmount, styles.expenseText]}>
              {formatCurrency(summary.totalExpense)}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Güncel Bakiye</Text>
            <Text style={[styles.summaryAmount, styles.balanceText]}>
              {formatCurrency(summary.balance)}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Kredi Kartı Borcu</Text>
            <Text style={[styles.summaryAmount, { color: '#F44336' }]}>
              {formatCurrency(totalDebt)}
            </Text>
          </View>
        </View>

        {/* İşlem Listesi */}
        <View style={styles.transactionsContainer}>
          <Text style={styles.sectionTitle}>{account.bankName} - {account.accountName} İşlem Geçmişi</Text>
          
          {/* Gelir İşlemleri */}
          {transactions.filter(t => t.transactionType === 'Gelir').length > 0 && (
            <View style={styles.transactionSection}>
              <Text style={styles.transactionSectionTitle}>Gelir İşlemleri</Text>
              {transactions
                .filter(transaction => transaction.transactionType === 'Gelir')
                .map((transaction) => (
                  <TouchableOpacity
                    key={transaction.bankTransactionId}
                    style={[styles.transactionItem, styles.incomeItem]}
                  >
                    <View style={styles.transactionLeft}>
                      <View style={[styles.transactionIcon, styles.incomeIcon]}>
                        <Icon name="arrow-down" size={24} color="#4CAF50" />
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
                    <Text style={[styles.transactionAmount, styles.incomeAmount]}>
                      +{formatCurrency(Math.abs(transaction.amount))}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          )}

          {/* Gider İşlemleri (Banka Kartı ile) */}
          {transactions.filter(t => t.transactionType === 'Gider').length > 0 && (
            <View style={styles.transactionSection}>
              <Text style={styles.transactionSectionTitle}>Gider İşlemleri</Text>
              {transactions
                .filter(transaction => transaction.transactionType === 'Gider')
                .map((transaction) => (
                  <TouchableOpacity
                    key={transaction.bankTransactionId}
                    style={[styles.transactionItem, styles.expenseItem]}
                  >
                    <View style={styles.transactionLeft}>
                      <View style={[styles.transactionIcon, styles.expenseIcon]}>
                        <Icon name="credit-card" size={24} color="#F44336" />
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
                    <Text style={[styles.transactionAmount, styles.expenseAmount]}>
                      -{formatCurrency(Math.abs(transaction.amount))}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          )}

          {/* Kredi Kartı Borçları */}
          {transactions.filter(t => t.transactionType === 'Debit').length > 0 && (
            <View style={styles.transactionSection}>
              <Text style={styles.transactionSectionTitle}>Kredi Kartı Borçları</Text>
              {transactions
                .filter(transaction => transaction.transactionType === 'Debit')
                .map((transaction) => (
                  <TouchableOpacity
                    key={transaction.bankTransactionId}
                    style={[styles.transactionItem, { borderLeftColor: '#FF9800' }]}
                  >
                    <View style={styles.transactionLeft}>
                      <View style={[styles.transactionIcon, { backgroundColor: '#FF980020' }]}>
                        <Icon name="credit-card-outline" size={24} color="#FF9800" />
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
                    <Text style={[styles.transactionAmount, { color: '#FF9800' }]}>
                      {formatCurrency(Math.abs(transaction.amount))}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default AccountDetailScreen; 