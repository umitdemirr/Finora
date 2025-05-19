import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BudgetHomeScreen = ({ navigation }) => {
  const [showBalance, setShowBalance] = useState(true);

  const financialSummary = {
    totalBalance: 45250.75,
    monthlyIncome: 12500.00,
    monthlyExpense: 8750.25,
    savingsGoal: 15000.00,
    savingsProgress: 10500.00,
  };

  const accounts = [
    { id: 1, name: 'Vadesiz Hesap', bank: 'Ziraat Bankası', balance: 15250.50, color: '#E3F2FD', icon: 'bank' },
    { id: 2, name: 'Birikim Hesabı', bank: 'İş Bankası', balance: 30000.25, color: '#FFF3E0', icon: 'piggy-bank' },
  ];

  const cards = [
    { id: 1, name: 'Bonus Kart', bank: 'Garanti', lastDigits: '4218', dueAmount: 2500.75, color: '#E8F5E9', icon: 'credit-card' },
    { id: 2, name: 'Maximum', bank: 'İş Bankası', lastDigits: '8742', dueAmount: 1750.25, color: '#F3E5F5', icon: 'credit-card-outline' },
  ];

  const recentTransactions = [
    { id: 1, title: 'Market Alışverişi', amount: -450.75, date: '2024-03-15', category: 'shopping' },
    { id: 2, title: 'Maaş', amount: 12500.00, date: '2024-03-01', category: 'income' },
    { id: 3, title: 'Elektrik Faturası', amount: -285.50, date: '2024-03-10', category: 'bills' },
  ];

  const quickActions = [
    { id: 'accounts', title: 'Hesaplarım', icon: 'bank', color: '#2196F3', screen: 'Accounts' },
    { id: 'cards', title: 'Kartlarım', icon: 'credit-card', color: '#4CAF50', screen: 'Cards' },
    { id: 'income', title: 'Gelirler', icon: 'cash-plus', color: '#00C853', screen: 'Income' },
    { id: 'expense', title: 'Giderler', icon: 'cash-minus', color: '#FF5252', screen: 'Expense' },
    { id: 'bills', title: 'Faturalar', icon: 'file-document-outline', color: '#FF9800', screen: 'Bills' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Finansal Özet */}
      <View style={styles.summaryCard}>
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceLabel}>Toplam Varlık</Text>
          <TouchableOpacity 
            onPress={() => setShowBalance(!showBalance)}
            style={styles.eyeButton}
          >
            <Icon 
              name={showBalance ? 'eye-outline' : 'eye-off-outline'} 
              size={24} 
              color="#666"
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.balanceAmount}>
          {showBalance 
            ? `₺${financialSummary.totalBalance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` 
            : '••••••'
          }
        </Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Aylık Gelir</Text>
            <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
              {showBalance ? `₺${financialSummary.monthlyIncome.toLocaleString('tr-TR')}` : '••••••'}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Aylık Gider</Text>
            <Text style={[styles.summaryValue, { color: '#F44336' }]}>
              {showBalance ? `₺${financialSummary.monthlyExpense.toLocaleString('tr-TR')}` : '••••••'}
            </Text>
          </View>
        </View>
      </View>

      {/* Hızlı Erişim */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Hızlı Erişim</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionButton}
              onPress={() => navigation.navigate(action.screen)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                <Icon name={action.icon} size={24} color="#FFF" />
              </View>
              <Text style={styles.quickActionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Hesaplarım */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Hesaplarım</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Accounts')}>
            <Text style={styles.seeAllButton}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {accounts.map((account) => (
            <TouchableOpacity
              key={account.id}
              style={[styles.accountCard, { backgroundColor: account.color }]}
              onPress={() => navigation.navigate('AccountDetail', { account })}
            >
              <Icon name={account.icon} size={24} color="#333" />
              <Text style={styles.accountName}>{account.name}</Text>
              <Text style={styles.accountBank}>{account.bank}</Text>
              <Text style={styles.accountBalance}>
                {showBalance 
                  ? `₺${account.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` 
                  : '••••••'
                }
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Kartlarım */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Kartlarım</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Cards')}>
            <Text style={styles.seeAllButton}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {cards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[styles.cardItem, { backgroundColor: card.color }]}
              onPress={() => navigation.navigate('CardDetail', { card })}
            >
              <Icon name={card.icon} size={24} color="#333" />
              <Text style={styles.cardName}>{card.name}</Text>
              <Text style={styles.cardNumber}>**** {card.lastDigits}</Text>
              <Text style={styles.cardDueAmount}>
                Güncel Borç: {showBalance 
                  ? `₺${card.dueAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` 
                  : '••••••'
                }
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Son İşlemler */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Son İşlemler</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text style={styles.seeAllButton}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>
        {recentTransactions.map((transaction) => (
          <TouchableOpacity
            key={transaction.id}
            style={styles.transactionItem}
            onPress={() => navigation.navigate('TransactionDetail', { transaction })}
          >
            <View style={styles.transactionLeft}>
              <Icon
                name={
                  transaction.category === 'shopping' ? 'cart' :
                  transaction.category === 'income' ? 'cash-plus' :
                  'file-document-outline'
                }
                size={24}
                color={transaction.amount >= 0 ? '#4CAF50' : '#F44336'}
              />
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>{transaction.title}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
            </View>
            <Text style={[
              styles.transactionAmount,
              { color: transaction.amount >= 0 ? '#4CAF50' : '#F44336' }
            ]}>
              {transaction.amount >= 0 ? '+' : ''}
              ₺{Math.abs(transaction.amount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
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
  summaryCard: {
    backgroundColor: '#FFF',
    padding: 20,
    margin: 16,
    borderRadius: 16,
    elevation: 2,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666',
  },
  eyeButton: {
    padding: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  quickActionsContainer: {
    padding: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  quickActionButton: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#333',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllButton: {
    color: '#2196F3',
    fontSize: 14,
  },
  accountCard: {
    width: 200,
    padding: 16,
    marginLeft: 16,
    borderRadius: 12,
    elevation: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
  },
  accountBank: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  accountBalance: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
  },
  cardItem: {
    width: 200,
    padding: 16,
    marginLeft: 16,
    borderRadius: 12,
    elevation: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
  },
  cardNumber: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  cardDueAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginTop: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    elevation: 1,
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
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BudgetHomeScreen; 