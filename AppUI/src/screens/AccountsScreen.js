import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AccountsScreen = ({ navigation }) => {
  const [showBalance, setShowBalance] = useState(true);

  const accounts = [
    { 
      id: 1, 
      name: 'Vadesiz Hesap', 
      bank: 'Ziraat Bankası', 
      balance: 15250.50, 
      iban: 'TR33 0001 0002 3456 7891 0123 45',
      color: '#E3F2FD', 
      icon: 'bank' 
    },
    { 
      id: 2, 
      name: 'Birikim Hesabı', 
      bank: 'İş Bankası', 
      balance: 30000.25, 
      iban: 'TR66 0004 5003 4567 8912 3456 78',
      color: '#FFF3E0', 
      icon: 'piggy-bank' 
    },
    { 
      id: 3, 
      name: 'Dolar Hesabı', 
      bank: 'Garanti', 
      balance: 5000.00, 
      iban: 'TR90 0006 7004 5678 9123 4567 89',
      color: '#E8F5E9', 
      icon: 'currency-usd' 
    },
  ];

  const renderAccountItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.accountCard, { backgroundColor: item.color }]}
      onPress={() => navigation.navigate('AccountDetail', { account: item })}
    >
      <View style={styles.accountHeader}>
        <Icon name={item.icon} size={24} color="#333" />
        <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
          <Icon 
            name={showBalance ? 'eye-outline' : 'eye-off-outline'} 
            size={20} 
            color="#666" 
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.accountName}>{item.name}</Text>
      <Text style={styles.bankName}>{item.bank}</Text>
      <Text style={styles.balance}>
        {showBalance 
          ? `₺${item.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` 
          : '••••••'
        }
      </Text>
      <Text style={styles.iban}>{item.iban}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={accounts}
        renderItem={renderAccountItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('AddAccount')}
      >
        <Icon name="plus" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContainer: {
    padding: 16,
  },
  accountCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  accountName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  bankName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  balance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  iban: {
    fontSize: 12,
    color: '#666',
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});

export default AccountsScreen; 