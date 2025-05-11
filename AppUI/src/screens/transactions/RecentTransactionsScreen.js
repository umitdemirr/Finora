import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const RecentTransactionsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'Tümü' },
    { id: 'income', label: 'Gelirler' },
    { id: 'expense', label: 'Giderler' },
  ];

  const categories = {
    income: [
      { id: 'salary', name: 'Maaş', icon: 'cash', color: '#4CAF50' },
      { id: 'investment', name: 'Yatırım', icon: 'chart-line', color: '#2196F3' },
      { id: 'freelance', name: 'Freelance', icon: 'laptop', color: '#9C27B0' },
      { id: 'other', name: 'Diğer', icon: 'dots-horizontal', color: '#607D8B' },
    ],
    expense: [
      { id: 'shopping', name: 'Alışveriş', icon: 'cart', color: '#FF9800' },
      { id: 'bills', name: 'Faturalar', icon: 'file-document', color: '#F44336' },
      { id: 'transport', name: 'Ulaşım', icon: 'car', color: '#2196F3' },
      { id: 'food', name: 'Yemek', icon: 'food', color: '#4CAF50' },
      { id: 'entertainment', name: 'Eğlence', icon: 'movie', color: '#9C27B0' },
      { id: 'other', name: 'Diğer', icon: 'dots-horizontal', color: '#607D8B' },
    ],
  };

  const transactions = [
    {
      id: 1,
      type: 'income',
      title: 'Maaş',
      amount: '15.000,00',
      date: '24 Mart 2024',
      category: 'salary',
      description: 'Mart ayı maaş ödemesi',
    },
    {
      id: 2,
      type: 'expense',
      title: 'Market Alışverişi',
      amount: '450,00',
      date: '24 Mart 2024',
      category: 'shopping',
      description: 'Haftalık market alışverişi',
    },
    {
      id: 3,
      type: 'expense',
      title: 'Elektrik Faturası',
      amount: '280,00',
      date: '23 Mart 2024',
      category: 'bills',
      description: 'Mart ayı elektrik faturası',
    },
    {
      id: 4,
      type: 'income',
      title: 'Freelance Proje',
      amount: '2.500,00',
      date: '22 Mart 2024',
      category: 'freelance',
      description: 'Web sitesi geliştirme projesi',
    },
  ];

  const filteredTransactions = transactions.filter((transaction) => {
    if (selectedFilter === 'all') return true;
    return transaction.type === selectedFilter;
  });

  const getCategoryInfo = (type, categoryId) => {
    return categories[type].find((cat) => cat.id === categoryId);
  };

  return (
    <View style={styles.container}>
      {/* Üst Bilgi Kartı */}
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>Son İşlemler</Text>
        <Text style={styles.headerSubtitle}>
          {filteredTransactions.length} işlem bulundu
        </Text>
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
        {filteredTransactions.map((transaction) => {
          const categoryInfo = getCategoryInfo(transaction.type, transaction.category);
          return (
            <TouchableOpacity
              key={transaction.id}
              style={styles.transactionItem}
              onPress={() => {
                Alert.alert(
                  transaction.title,
                  `Tutar: ₺${transaction.amount}\nTarih: ${transaction.date}\nKategori: ${transaction.type === 'income' 
                    ? categories.income.find(c => c.id === transaction.category)?.name
                    : categories.expense.find(c => c.id === transaction.category)?.name}\nAçıklama: ${transaction.description}`,
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
                    { backgroundColor: categoryInfo.color + '20' },
                  ]}
                >
                  <Icon
                    name={categoryInfo.icon}
                    size={24}
                    color={categoryInfo.color}
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>{transaction.title}</Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                  <Text style={styles.transactionDescription}>
                    {transaction.description}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  {
                    color: transaction.type === 'income' ? '#4CAF50' : '#F44336',
                  },
                ]}
              >
                {transaction.type === 'income' ? '+' : '-'}₺{transaction.amount}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  transactionDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RecentTransactionsScreen;