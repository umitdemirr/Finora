import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;

  const quickActions = [
    { icon: 'cash-plus', title: 'Gelirler', screen: 'Income', color: '#4CAF50' },
    { icon: 'cash-minus', title: 'Giderler', screen: 'Expense', color: '#F44336' },
    { icon: 'clock-outline', title: 'İşlemler', screen: 'RecentTransactions', color: '#2196F3' },
    { icon: 'bank-transfer', title: 'Transfer', screen: 'Transfers', color: '#FF9800' },
    { icon: 'credit-card', title: 'Kartlar', screen: 'Cards', color: '#9C27B0' },
    { icon: 'chart-line', title: 'Yatırım', screen: 'Portfolio', color: '#2196F3' },
  ];

  const recentTransactions = [
    {
      id: 1,
      title: 'Market Alışverişi',
      amount: '-₺250,00',
      date: 'Bugün',
      type: 'expense',
      category: 'market',
      icon: 'cart',
    },
    {
      id: 2,
      title: 'Maaş',
      amount: '+₺15.000,00',
      date: 'Dün',
      type: 'income',
      category: 'salary',
      icon: 'cash',
    },
    {
      id: 3,
      title: 'Fatura Ödemesi',
      amount: '-₺450,00',
      date: '23 Mart',
      type: 'expense',
      category: 'bill',
      icon: 'file-document',
    },
  ];

  const marketSummary = [
    { name: 'USD/TRY', value: '32.45', change: '+0.45%', trend: 'up' },
    { name: 'EUR/TRY', value: '35.12', change: '-0.12%', trend: 'down' },
    { name: 'BTC/USD', value: '65,432', change: '+2.34%', trend: 'up' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Üst Bilgi Kartı */}
      <View style={styles.headerCard}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.welcomeText}>Merhaba, Ümit</Text>
            <Text style={styles.dateText}>24 Mart 2024</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Icon name="bell-outline" size={24} color="#fff" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Toplam Bakiye</Text>
          <Text style={styles.balanceAmount}>₺25.750,00</Text>
        </View>
        <View style={styles.accountInfo}>
          <Text style={styles.accountNumber}>TR12 3456 7890 1234 5678</Text>
          <Text style={styles.accountName}>Vadesiz TL Hesabı</Text>
        </View>
      </View>

      {/* Hızlı İşlemler */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickActionItem}
              onPress={() => navigation.navigate(action.screen)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                <Icon name={action.icon} size={24} color="#fff" />
              </View>
              <Text style={styles.quickActionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Finansal Özet */}
      <View style={styles.financialSummary}>
        <Text style={styles.sectionTitle}>Finansal Özet</Text>
        <View style={styles.summaryCards}>
          <View style={[styles.summaryCard, { backgroundColor: '#4CAF50' }]}>
            <Icon name="arrow-up" size={24} color="#fff" />
            <Text style={[styles.summaryAmount, { color: '#fff' }]}>₺15.000,00</Text>
            <Text style={[styles.summaryLabel, { color: '#fff' }]}>Aylık Gelir</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#F44336' }]}>
            <Icon name="arrow-down" size={24} color="#fff" />
            <Text style={[styles.summaryAmount, { color: '#fff' }]}>₺8.500,00</Text>
            <Text style={[styles.summaryLabel, { color: '#fff' }]}>Aylık Gider</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#2196F3' }]}>
            <Icon name="chart-line" size={24} color="#fff" />
            <Text style={[styles.summaryAmount, { color: '#fff' }]}>₺6.500,00</Text>
            <Text style={[styles.summaryLabel, { color: '#fff' }]}>Tasarruf</Text>
          </View>
        </View>
      </View>

      {/* Piyasa Özeti */}
      <View style={styles.marketSummary}>
        <Text style={styles.sectionTitle}>Piyasa Özeti</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {marketSummary.map((item, index) => (
            <View key={index} style={styles.marketItem}>
              <Text style={styles.marketName}>{item.name}</Text>
              <Text style={styles.marketValue}>{item.value}</Text>
              <Text style={[
                styles.marketChange,
                { color: item.trend === 'up' ? '#4CAF50' : '#F44336' }
              ]}>
                {item.change}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Son İşlemler */}
      <View style={styles.recentTransactions}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Son İşlemler</Text>
          <TouchableOpacity onPress={() => navigation.navigate('RecentTransactions')}>
            <Text style={styles.seeAllText}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>
        {recentTransactions.map((transaction) => (
          <TouchableOpacity
            key={transaction.id}
            style={styles.transactionItem}
            onPress={() => {
              if (transaction.type === 'income') {
                navigation.navigate('Income');
              } else {
                navigation.navigate('Expense');
              }
            }}
          >
            <View style={[
              styles.transactionIcon,
              { backgroundColor: transaction.type === 'income' ? '#E8F5E9' : '#FFEBEE' }
            ]}>
              <Icon
                name={transaction.icon}
                size={24}
                color={transaction.type === 'income' ? '#4CAF50' : '#F44336'}
              />
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>{transaction.title}</Text>
              <Text style={styles.transactionDate}>{transaction.date}</Text>
            </View>
            <Text
              style={[
                styles.transactionAmount,
                { color: transaction.type === 'income' ? '#4CAF50' : '#F44336' },
              ]}
            >
              {transaction.amount}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerCard: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.8,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  balanceContainer: {
    marginBottom: 10,
  },
  balanceLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.8,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  accountInfo: {
    marginTop: 10,
  },
  accountNumber: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.8,
  },
  accountName: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  quickActionsContainer: {
    padding: 20,
    marginTop: -20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 15,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quickActionText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  financialSummary: {
    padding: 20,
  },
  summaryCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryCard: {
    flex: 1,
    padding: 15,
    borderRadius: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  summaryLabel: {
    fontSize: 12,
  },
  marketSummary: {
    padding: 20,
  },
  marketItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 15,
    marginRight: 10,
    width: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  marketName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  marketValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  marketChange: {
    fontSize: 12,
    marginTop: 5,
  },
  recentTransactions: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAllText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 15,
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
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;