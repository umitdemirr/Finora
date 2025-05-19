import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

const BudgetHomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [budgetData, setBudgetData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    categories: [],
    recentTransactions: [],
    accounts: [],
    cards: []
  });

  useEffect(() => {
    fetchBudgetData();
  }, []);

  const fetchBudgetData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Hata', 'Kullanıcı bilgileri alınamadı');
        return;
      }

      // Hesapları getir
      const accountsResponse = await api.get(`/BankAccount/getdetail?userId=${userId}`);
      const accounts = accountsResponse.data.success ? accountsResponse.data.data : [];

      // Kartları getir
      const cardsResponse = await api.get(`/BankCard/getdetail?userId=${userId}`);
      const cards = cardsResponse.data.success ? cardsResponse.data.data : [];

      // Örnek veriler
      setBudgetData({
        totalIncome: 15000,
        totalExpense: 8500,
        balance: 6500,
        categories: [
          { id: 1, name: 'Market', amount: 2500, icon: 'cart', color: '#FF6B6B' },
          { id: 2, name: 'Faturalar', amount: 1800, icon: 'file-document', color: '#4ECDC4' },
          { id: 3, name: 'Ulaşım', amount: 1200, icon: 'car', color: '#45B7D1' },
          { id: 4, name: 'Eğlence', amount: 800, icon: 'movie', color: '#96CEB4' },
        ],
        recentTransactions: [
          { id: 1, title: 'Market Alışverişi', amount: -250, date: '2024-03-15', category: 'Market' },
          { id: 2, title: 'Maaş', amount: 15000, date: '2024-03-14', category: 'Gelir' },
          { id: 3, title: 'Elektrik Faturası', amount: -450, date: '2024-03-13', category: 'Faturalar' },
        ],
        accounts,
        cards
      });
    } catch (error) {
      console.error('Bütçe bilgileri alınamadı:', error);
      Alert.alert('Hata', 'Bütçe bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Bütçe Özeti */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Bütçe Özeti</Text>
        <View style={styles.summaryCards}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Toplam Gelir</Text>
            <Text style={[styles.summaryAmount, styles.incomeText]}>
              {formatCurrency(budgetData.totalIncome)}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Toplam Gider</Text>
            <Text style={[styles.summaryAmount, styles.expenseText]}>
              {formatCurrency(budgetData.totalExpense)}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Bakiye</Text>
            <Text style={[styles.summaryAmount, styles.balanceText]}>
              {formatCurrency(budgetData.balance)}
            </Text>
          </View>
        </View>
      </View>

      {/* Hesaplar ve Kartlar */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Hesaplarım ve Kartlarım</Text>
        </View>
        
        {/* Hesaplar */}
        <View style={styles.accountsContainer}>
          <View style={styles.sectionSubHeader}>
            <Text style={styles.sectionSubTitle}>Hesaplar</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Accounts')}>
              <Text style={styles.seeAllText}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.accountsScroll}>
            {budgetData.accounts.map((account) => (
              <TouchableOpacity
                key={account.accountId}
                style={styles.accountCard}
                onPress={() => navigation.navigate('AccountDetail', { account })}
              >
                <View style={styles.accountHeader}>
                  <Icon name="bank" size={20} color="#666" />
                  <Text style={styles.bankName}>{account.bankName}</Text>
                </View>
                <Text style={styles.accountName}>{account.accountName}</Text>
                <Text style={styles.accountBalance}>
                  {formatCurrency(parseFloat(account.balance))}
                </Text>
                <Text style={styles.accountCurrency}>{account.currencyName}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Kartlar */}
        <View style={styles.cardsContainer}>
          <View style={styles.sectionSubHeader}>
            <Text style={styles.sectionSubTitle}>Kartlar</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Cards')}>
              <Text style={styles.seeAllText}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsScroll}>
            {budgetData.cards.map((card) => (
              <TouchableOpacity
                key={card.id}
                style={styles.cardCard}
                onPress={() => navigation.navigate('Cards')}
              >
                <View style={styles.cardHeader}>
                  <Icon 
                    name={card.provider === 'VISA' ? 'credit-card' : 'credit-card-outline'} 
                    size={24} 
                    color="#007AFF" 
                  />
                  <Text style={styles.cardName}>{card.cardName}</Text>
                </View>
                <Text style={styles.cardNumber}>
                  {card.cardNumber ? `**** **** **** ${card.cardNumber.slice(-4)}` : '**** **** **** ****'}
                </Text>
                <Text style={styles.cardExpiry}>{card.expiryDate}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Harcama Kategorileri */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Harcama Kategorileri</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
            <Text style={styles.seeAllText}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {budgetData.categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => navigation.navigate('CategoryDetail', { category })}
            >
              <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                <Icon name={category.icon} size={24} color="#fff" />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryAmount}>{formatCurrency(category.amount)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Son İşlemler */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Son İşlemler</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text style={styles.seeAllText}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>
        {budgetData.recentTransactions.map((transaction) => (
          <TouchableOpacity
            key={transaction.id}
            style={styles.transactionItem}
            onPress={() => navigation.navigate('TransactionDetail', { transaction })}
          >
            <View style={styles.transactionLeft}>
              <Icon
                name={transaction.amount > 0 ? 'arrow-down' : 'arrow-up'}
                size={24}
                color={transaction.amount > 0 ? '#4CAF50' : '#FF5252'}
              />
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>{transaction.title}</Text>
                <Text style={styles.transactionCategory}>{transaction.category}</Text>
              </View>
            </View>
            <View style={styles.transactionRight}>
              <Text
                style={[
                  styles.transactionAmount,
                  transaction.amount > 0 ? styles.incomeText : styles.expenseText,
                ]}
              >
                {formatCurrency(transaction.amount)}
              </Text>
              <Text style={styles.transactionDate}>{transaction.date}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
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
  summaryContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  summaryCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  incomeText: {
    color: '#4CAF50',
  },
  expenseText: {
    color: '#FF5252',
  },
  balanceText: {
    color: '#007AFF',
  },
  sectionContainer: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionSubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionSubTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  seeAllText: {
    color: '#007AFF',
    fontSize: 14,
  },
  accountsContainer: {
    marginBottom: 20,
  },
  accountsScroll: {
    flexDirection: 'row',
  },
  accountCard: {
    width: 200,
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bankName: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  accountName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  accountBalance: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  accountCurrency: {
    fontSize: 12,
    color: '#666',
  },
  cardsContainer: {
    marginTop: 20,
  },
  cardsScroll: {
    flexDirection: 'row',
  },
  cardCard: {
    width: 200,
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardName: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  cardNumber: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    letterSpacing: 1,
  },
  cardExpiry: {
    fontSize: 12,
    color: '#666',
  },
  categoriesContainer: {
    flexDirection: 'row',
  },
  categoryCard: {
    width: 120,
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  categoryAmount: {
    fontSize: 12,
    color: '#666',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionInfo: {
    marginLeft: 12,
  },
  transactionTitle: {
    fontSize: 16,
    color: '#333',
  },
  transactionCategory: {
    fontSize: 12,
    color: '#666',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
  },
});

export default BudgetHomeScreen; 