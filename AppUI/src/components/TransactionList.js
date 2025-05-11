import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TransactionList = ({ transactions }) => {
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'shopping':
        return 'shopping';
      case 'transfer':
        return 'bank-transfer';
      case 'bill':
        return 'file-document-outline';
      default:
        return 'cash';
    }
  };

  return (
    <View style={styles.transactionsContainer}>
      <Text style={styles.sectionTitle}>Son İşlemler</Text>
      {transactions.map((transaction) => (
        <View key={transaction.id} style={styles.transaction}>
          <View style={styles.transactionLeft}>
            <Icon
              name={getTransactionIcon(transaction.type)}
              size={24}
              color="#007AFF"
            />
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>{transaction.title}</Text>
              <Text style={styles.transactionDate}>{transaction.date}</Text>
            </View>
          </View>
          <Text
            style={[
              styles.transactionAmount,
              { color: transaction.amount < 0 ? '#FF3B30' : '#34C759' },
            ]}
          >
            {transaction.amount < 0 ? '-' : '+'}₺{Math.abs(transaction.amount).toFixed(2)}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  transactionsContainer: {
    backgroundColor: '#ffffff',
    margin: 20,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  transaction: {
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
  transactionDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TransactionList; 