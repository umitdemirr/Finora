import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BillsScreen = ({ navigation }) => {
  const [showBalance, setShowBalance] = useState(true);

  const bills = [
    {
      id: 1,
      type: 'Elektrik',
      provider: 'CK Boğaziçi Elektrik',
      amount: 285.50,
      dueDate: '2024-03-25',
      status: 'pending',
      icon: 'flash',
      subscriberNo: '1234567890',
    },
    {
      id: 2,
      type: 'Su',
      provider: 'İSKİ',
      amount: 175.25,
      dueDate: '2024-03-28',
      status: 'pending',
      icon: 'water',
      subscriberNo: '9876543210',
    },
    {
      id: 3,
      type: 'Doğalgaz',
      provider: 'İGDAŞ',
      amount: 450.75,
      dueDate: '2024-03-22',
      status: 'pending',
      icon: 'fire',
      subscriberNo: '5432167890',
    },
    {
      id: 4,
      type: 'İnternet',
      provider: 'Türk Telekom',
      amount: 329.90,
      dueDate: '2024-03-15',
      status: 'paid',
      icon: 'wifi',
      subscriberNo: '6789054321',
    },
  ];

  const quickPayments = [
    { id: 'electric', name: 'Elektrik', icon: 'flash' },
    { id: 'water', name: 'Su', icon: 'water' },
    { id: 'gas', name: 'Doğalgaz', icon: 'fire' },
    { id: 'internet', name: 'İnternet', icon: 'wifi' },
    { id: 'phone', name: 'Telefon', icon: 'phone' },
    { id: 'tv', name: 'TV', icon: 'television' },
  ];

  const renderBillItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.billCard,
        { opacity: item.status === 'paid' ? 0.7 : 1 }
      ]}
      onPress={() => navigation.navigate('BillDetail', { bill: item })}
    >
      <View style={styles.billHeader}>
        <View style={styles.billIcon}>
          <Icon name={item.icon} size={24} color="#2196F3" />
        </View>
        <View style={styles.billInfo}>
          <Text style={styles.billType}>{item.type}</Text>
          <Text style={styles.billProvider}>{item.provider}</Text>
        </View>
        <View style={styles.billAmount}>
          <Text style={styles.amountText}>
            {showBalance 
              ? `₺${item.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` 
              : '••••••'
            }
          </Text>
          <Text style={[
            styles.statusText,
            { color: item.status === 'paid' ? '#4CAF50' : '#F44336' }
          ]}>
            {item.status === 'paid' ? 'Ödendi' : 'Bekliyor'}
          </Text>
        </View>
      </View>
      <View style={styles.billFooter}>
        <Text style={styles.subscriberNo}>Abone No: {item.subscriberNo}</Text>
        <Text style={styles.dueDate}>Son Ödeme: {item.dueDate}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.totalLabel}>Toplam Ödenecek Faturalar</Text>
        <View style={styles.totalContainer}>
          <Text style={styles.totalAmount}>
            {showBalance 
              ? `₺${bills
                  .filter(bill => bill.status === 'pending')
                  .reduce((sum, bill) => sum + bill.amount, 0)
                  .toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` 
              : '••••••'
            }
          </Text>
          <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
            <Icon 
              name={showBalance ? 'eye-outline' : 'eye-off-outline'} 
              size={24} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.quickPayments}>
        <Text style={styles.sectionTitle}>Hızlı Ödeme</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickPaymentsContainer}
        >
          {quickPayments.map(payment => (
            <TouchableOpacity 
              key={payment.id}
              style={styles.quickPaymentButton}
              onPress={() => navigation.navigate('BillPayment', { type: payment.id })}
            >
              <View style={styles.quickPaymentIcon}>
                <Icon name={payment.icon} size={24} color="#2196F3" />
              </View>
              <Text style={styles.quickPaymentText}>{payment.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.billsList}>
        <View style={styles.billsHeader}>
          <Text style={styles.sectionTitle}>Faturalarım</Text>
          <TouchableOpacity onPress={() => navigation.navigate('BillHistory')}>
            <Text style={styles.viewAllButton}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={bills}
          renderItem={renderBillItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFF',
    padding: 16,
    elevation: 2,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  quickPayments: {
    backgroundColor: '#FFF',
    padding: 16,
    marginTop: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  quickPaymentsContainer: {
    paddingRight: 16,
  },
  quickPaymentButton: {
    alignItems: 'center',
    marginRight: 16,
  },
  quickPaymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickPaymentText: {
    fontSize: 12,
    color: '#666',
  },
  billsList: {
    flex: 1,
    marginTop: 8,
  },
  billsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    elevation: 2,
  },
  viewAllButton: {
    color: '#2196F3',
    fontSize: 14,
  },
  listContainer: {
    padding: 16,
  },
  billCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  billHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  billIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  billInfo: {
    flex: 1,
  },
  billType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  billProvider: {
    fontSize: 12,
    color: '#666',
  },
  billAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  billFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subscriberNo: {
    fontSize: 12,
    color: '#666',
  },
  dueDate: {
    fontSize: 12,
    color: '#666',
  },
});

export default BillsScreen; 