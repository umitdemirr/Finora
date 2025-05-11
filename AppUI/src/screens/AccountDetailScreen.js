import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AccountDetailScreen = ({ route, navigation }) => {
  const { account } = route.params;
  const [showBalance, setShowBalance] = useState(true);

  const transactions = [
    {
      id: 1,
      title: 'Market Alışverişi',
      amount: -450.75,
      date: '2024-03-15',
      category: 'shopping',
      description: 'Haftalık market alışverişi',
    },
    {
      id: 2,
      title: 'Maaş',
      amount: 12500.00,
      date: '2024-03-01',
      category: 'salary',
      description: 'Mart ayı maaş ödemesi',
    },
    {
      id: 3,
      title: 'Elektrik Faturası',
      amount: -285.50,
      date: '2024-03-10',
      category: 'bills',
      description: 'Mart ayı elektrik faturası',
    },
  ];

  const quickActions = [
    { id: 'transfer', name: 'Para Transferi', icon: 'bank-transfer' },
    { id: 'payment', name: 'Ödeme', icon: 'cash-fast' },
    { id: 'statement', name: 'Hesap Özeti', icon: 'file-document-outline' },
    { id: 'share', name: 'IBAN Paylaş', icon: 'share-variant' },
  ];

  const getCategoryIcon = (category) => {
    const icons = {
      shopping: 'cart',
      salary: 'cash-multiple',
      bills: 'file-document',
      transfer: 'bank-transfer',
      other: 'dots-horizontal',
    };
    return icons[category] || icons.other;
  };

  const renderTransactionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.transactionItem}
      onPress={() => navigation.navigate('TransactionDetail', { transaction: item })}
    >
      <View style={styles.transactionHeader}>
        <View style={styles.transactionLeft}>
          <View style={[
            styles.categoryIcon,
            { backgroundColor: item.amount >= 0 ? '#E8F5E9' : '#FFEBEE' }
          ]}>
            <Icon
              name={getCategoryIcon(item.category)}
              size={24}
              color={item.amount >= 0 ? '#4CAF50' : '#F44336'}
            />
          </View>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionTitle}>{item.title}</Text>
            <Text style={styles.transactionDate}>{item.date}</Text>
          </View>
        </View>
        <Text style={[
          styles.transactionAmount,
          { color: item.amount >= 0 ? '#4CAF50' : '#F44336' }
        ]}>
          {showBalance
            ? `${item.amount >= 0 ? '+' : ''}₺${Math.abs(item.amount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`
            : '••••••'
          }
        </Text>
      </View>
      <Text style={styles.transactionDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.accountCard, { backgroundColor: account.color }]}>
        <View style={styles.accountHeader}>
          <View style={styles.accountIconContainer}>
            <Icon name={account.icon} size={32} color="#2196F3" />
          </View>
          <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
            <Icon 
              name={showBalance ? 'eye-outline' : 'eye-off-outline'} 
              size={24} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.accountName}>{account.name}</Text>
        <Text style={styles.bankName}>{account.bank}</Text>
        <Text style={styles.balance}>
          {showBalance
            ? `₺${account.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`
            : '••••••'
          }
        </Text>
        <Text style={styles.iban}>{account.iban}</Text>
      </View>

      <View style={styles.quickActions}>
        {quickActions.map(action => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionButton}
            onPress={() => navigation.navigate(action.id === 'transfer' ? 'Transfer' : action.id === 'payment' ? 'Payment' : action.id === 'statement' ? 'Statement' : 'Share')}
          >
            <View style={styles.actionIcon}>
              <Icon name={action.icon} size={24} color="#2196F3" />
            </View>
            <Text style={styles.actionText}>{action.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.transactionsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Son İşlemler</Text>
          <TouchableOpacity onPress={() => navigation.navigate('TransactionHistory', { accountId: account.id })}>
            <Text style={styles.viewAllButton}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={transactions}
          renderItem={renderTransactionItem}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  accountCard: {
    padding: 20,
    margin: 16,
    borderRadius: 12,
    elevation: 2,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  accountIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  bankName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  balance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  iban: {
    fontSize: 14,
    color: '#666',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFF',
    marginBottom: 16,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#666',
  },
  transactionsSection: {
    backgroundColor: '#FFF',
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllButton: {
    color: '#2196F3',
    fontSize: 14,
  },
  transactionItem: {
    marginBottom: 16,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
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
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionDescription: {
    fontSize: 12,
    color: '#666',
    marginLeft: 52,
  },
});

export default AccountDetailScreen; 