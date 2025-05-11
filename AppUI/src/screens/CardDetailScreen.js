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

const CardDetailScreen = ({ route, navigation }) => {
  const { card } = route.params;
  const [showBalance, setShowBalance] = useState(true);

  const transactions = [
    {
      id: 1,
      title: 'Market Alışverişi',
      amount: 450.75,
      date: '2024-03-15',
      category: 'shopping',
      location: 'Migros',
      installment: '1/1',
    },
    {
      id: 2,
      title: 'Elektronik',
      amount: 2500.00,
      date: '2024-03-10',
      category: 'electronics',
      location: 'MediaMarkt',
      installment: '3/12',
    },
    {
      id: 3,
      title: 'Restoran',
      amount: 350.00,
      date: '2024-03-08',
      category: 'dining',
      location: 'Köfteci Yusuf',
      installment: '1/1',
    },
  ];

  const quickActions = [
    { id: 'limit', name: 'Limit Ayarları', icon: 'credit-card-settings' },
    { id: 'statement', name: 'Ekstre', icon: 'file-document' },
    { id: 'points', name: 'Puanlar', icon: 'star' },
    { id: 'security', name: 'Güvenlik', icon: 'shield' },
  ];

  const getCategoryIcon = (category) => {
    const icons = {
      shopping: 'cart',
      electronics: 'laptop',
      dining: 'food',
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
          <View style={styles.categoryIcon}>
            <Icon name={getCategoryIcon(item.category)} size={24} color="#F44336" />
          </View>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionTitle}>{item.title}</Text>
            <Text style={styles.transactionLocation}>{item.location}</Text>
          </View>
        </View>
        <View style={styles.transactionRight}>
          <Text style={styles.transactionAmount}>
            {showBalance
              ? `-₺${item.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`
              : '••••••'
            }
          </Text>
          <Text style={styles.installmentText}>{item.installment}</Text>
        </View>
      </View>
      <Text style={styles.transactionDate}>{item.date}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.cardCard, { backgroundColor: card.color }]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIconContainer}>
            <Icon name={card.icon} size={32} color="#2196F3" />
          </View>
          <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
            <Icon 
              name={showBalance ? 'eye-outline' : 'eye-off-outline'} 
              size={24} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.cardName}>{card.name}</Text>
        <Text style={styles.bankName}>{card.bank}</Text>
        <Text style={styles.cardNumber}>{card.number}</Text>
        <Text style={styles.expiryDate}>Son Kullanma: {card.expiryDate}</Text>

        {card.type === 'Credit' && (
          <View style={styles.balanceContainer}>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>Güncel Borç</Text>
              <Text style={[styles.balanceValue, { color: '#F44336' }]}>
                {showBalance
                  ? `₺${card.dueAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`
                  : '••••••'
                }
              </Text>
            </View>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>Kullanılabilir Limit</Text>
              <Text style={[styles.balanceValue, { color: '#4CAF50' }]}>
                {showBalance
                  ? `₺${card.availableLimit.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`
                  : '••••••'
                }
              </Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.quickActions}>
        {quickActions.map(action => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionButton}
            onPress={() => navigation.navigate(action.id.charAt(0).toUpperCase() + action.id.slice(1))}
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
          <TouchableOpacity onPress={() => navigation.navigate('CardTransactions', { cardId: card.id })}>
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
  cardCard: {
    padding: 20,
    margin: 16,
    borderRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardName: {
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
  cardNumber: {
    fontSize: 18,
    letterSpacing: 2,
    color: '#333',
    marginBottom: 8,
  },
  expiryDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  balanceItem: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
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
    marginBottom: 4,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFEBEE',
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
  transactionLocation: {
    fontSize: 12,
    color: '#666',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 4,
  },
  installmentText: {
    fontSize: 12,
    color: '#666',
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
    marginLeft: 52,
  },
});

export default CardDetailScreen; 