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

const IncomeScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [searchQuery, setSearchQuery] = useState('');

  const periods = [
    { id: 'week', label: 'Hafta' },
    { id: 'month', label: 'Ay' },
    { id: 'year', label: 'Yıl' },
  ];

  const incomeCategories = [
    { id: 'salary', name: 'Maaş', icon: 'cash', color: '#4CAF50' },
    { id: 'investment', name: 'Yatırım', icon: 'chart-line', color: '#2196F3' },
    { id: 'freelance', name: 'Serbest Çalışma', icon: 'laptop', color: '#FF9800' },
    { id: 'other', name: 'Diğer', icon: 'dots-horizontal', color: '#9C27B0' },
  ];

  const incomeTransactions = [
    {
      id: 1,
      title: 'Maaş',
      amount: '15.000,00',
      date: '24 Mart 2024',
      category: 'salary',
      description: 'Mart ayı maaş ödemesi',
    },
    {
      id: 2,
      title: 'Yatırım Getirisi',
      amount: '2.500,00',
      date: '23 Mart 2024',
      category: 'investment',
      description: 'Hisse senedi karı',
    },
    {
      id: 3,
      title: 'Freelance Proje',
      amount: '5.000,00',
      date: '22 Mart 2024',
      category: 'freelance',
      description: 'Web sitesi geliştirme projesi',
    },
  ];

  const totalIncome = incomeTransactions.reduce((sum, transaction) => 
    sum + parseFloat(transaction.amount.replace('.', '').replace(',', '.')), 0
  );

  return (
    <View style={styles.container}>
      {/* Üst Bilgi Kartı */}
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>Toplam Gelir</Text>
        <Text style={styles.headerAmount}>₺{totalIncome.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</Text>
      </View>

      {/* Dönem Seçici */}
      <View style={styles.periodSelector}>
        {periods.map((period) => (
          <TouchableOpacity
            key={period.id}
            style={[
              styles.periodButton,
              selectedPeriod === period.id && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod(period.id)}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === period.id && styles.periodButtonTextActive,
              ]}
            >
              {period.label}
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

      {/* Kategori Özeti */}
      <View style={styles.categorySummary}>
        <Text style={styles.sectionTitle}>Kategori Bazlı Gelirler</Text>
        <View style={styles.categoryGrid}>
          {incomeCategories.map((category) => (
            <View key={category.id} style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                <Icon name={category.icon} size={24} color={category.color} />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* İşlem Listesi */}
      <View style={styles.transactionsList}>
        <Text style={styles.sectionTitle}>Son Gelirler</Text>
        {incomeTransactions.map((transaction) => (
          <TouchableOpacity
            key={transaction.id}
            style={styles.transactionItem}
            onPress={() => {
              // İşlem detaylarını göster
              Alert.alert(
                transaction.title,
                `Tutar: ₺${transaction.amount}\nTarih: ${transaction.date}\nKategori: ${incomeCategories.find(c => c.id === transaction.category)?.name}\nAçıklama: ${transaction.description}`,
                [
                  {
                    text: 'Düzenle',
                    onPress: () => {
                      // Düzenleme ekranına git
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
                  {
                    backgroundColor:
                      incomeCategories.find((c) => c.id === transaction.category)?.color + '20',
                  },
                ]}
              >
                <Icon
                  name={incomeCategories.find((c) => c.id === transaction.category)?.icon}
                  size={24}
                  color={incomeCategories.find((c) => c.id === transaction.category)?.color}
                />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>{transaction.title}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
                <Text style={styles.transactionDescription}>{transaction.description}</Text>
              </View>
            </View>
            <Text style={[styles.transactionAmount, { color: '#4CAF50' }]}>
              +₺{transaction.amount}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerCard: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.8,
  },
  headerAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 5,
  },
  periodSelector: {
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
  periodButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  periodButtonActive: {
    backgroundColor: '#4CAF50',
  },
  periodButtonText: {
    color: '#666',
    fontSize: 14,
  },
  periodButtonTextActive: {
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
  categorySummary: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
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
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  transactionsList: {
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

export default IncomeScreen; 