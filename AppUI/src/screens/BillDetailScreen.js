import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BillDetailScreen = ({ route, navigation }) => {
  const { bill } = route.params;
  const [showBalance, setShowBalance] = useState(true);

  const billDetails = {
    periodStart: '2024-02-15',
    periodEnd: '2024-03-15',
    consumption: bill.type === 'Elektrik' ? '245 kWh' : 
                bill.type === 'Su' ? '12 m³' :
                bill.type === 'Doğalgaz' ? '85 m³' : '-',
    previousReading: bill.type === 'Elektrik' ? '12450 kWh' :
                    bill.type === 'Su' ? '458 m³' :
                    bill.type === 'Doğalgaz' ? '2850 m³' : '-',
    currentReading: bill.type === 'Elektrik' ? '12695 kWh' :
                   bill.type === 'Su' ? '470 m³' :
                   bill.type === 'Doğalgaz' ? '2935 m³' : '-',
    breakdown: [
      { label: 'Tüketim Bedeli', amount: bill.amount * 0.8 },
      { label: 'KDV (%18)', amount: bill.amount * 0.18 },
      { label: 'Diğer Vergiler', amount: bill.amount * 0.02 },
    ],
  };

  const paymentMethods = [
    { id: 'card', name: 'Kredi Kartı', icon: 'credit-card' },
    { id: 'account', name: 'Hesaptan Öde', icon: 'bank' },
    { id: 'auto', name: 'Otomatik Ödeme', icon: 'calendar-clock' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.billCard, { backgroundColor: '#E3F2FD' }]}>
        <View style={styles.billHeader}>
          <View style={styles.billIconContainer}>
            <Icon name={bill.icon} size={32} color="#2196F3" />
          </View>
          <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
            <Icon 
              name={showBalance ? 'eye-outline' : 'eye-off-outline'} 
              size={24} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.billType}>{bill.type}</Text>
        <Text style={styles.provider}>{bill.provider}</Text>
        <Text style={styles.subscriberNo}>Abone No: {bill.subscriberNo}</Text>
        
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Ödenecek Tutar</Text>
          <Text style={styles.amount}>
            {showBalance
              ? `₺${bill.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`
              : '••••••'
            }
          </Text>
        </View>
        
        <Text style={styles.dueDate}>Son Ödeme: {bill.dueDate}</Text>
      </View>

      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Fatura Detayları</Text>
        
        <View style={styles.periodContainer}>
          <View style={styles.periodItem}>
            <Text style={styles.periodLabel}>Dönem Başlangıç</Text>
            <Text style={styles.periodValue}>{billDetails.periodStart}</Text>
          </View>
          <View style={styles.periodItem}>
            <Text style={styles.periodLabel}>Dönem Bitiş</Text>
            <Text style={styles.periodValue}>{billDetails.periodEnd}</Text>
          </View>
        </View>

        <View style={styles.readingContainer}>
          <View style={styles.readingItem}>
            <Text style={styles.readingLabel}>Önceki Okuma</Text>
            <Text style={styles.readingValue}>{billDetails.previousReading}</Text>
          </View>
          <View style={styles.readingItem}>
            <Text style={styles.readingLabel}>Son Okuma</Text>
            <Text style={styles.readingValue}>{billDetails.currentReading}</Text>
          </View>
          <View style={styles.readingItem}>
            <Text style={styles.readingLabel}>Tüketim</Text>
            <Text style={styles.readingValue}>{billDetails.consumption}</Text>
          </View>
        </View>

        <View style={styles.breakdownContainer}>
          {billDetails.breakdown.map((item, index) => (
            <View key={index} style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>{item.label}</Text>
              <Text style={styles.breakdownValue}>
                {showBalance
                  ? `₺${item.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`
                  : '••••••'
                }
              </Text>
            </View>
          ))}
          <View style={styles.totalItem}>
            <Text style={styles.totalLabel}>Toplam</Text>
            <Text style={styles.totalValue}>
              {showBalance
                ? `₺${bill.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`
                : '••••••'
              }
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.paymentSection}>
        <Text style={styles.sectionTitle}>Ödeme Yöntemi</Text>
        <View style={styles.paymentMethods}>
          {paymentMethods.map(method => (
            <TouchableOpacity
              key={method.id}
              style={styles.paymentButton}
              onPress={() => navigation.navigate('BillPayment', { bill, method: method.id })}
            >
              <View style={styles.paymentIcon}>
                <Icon name={method.icon} size={24} color="#2196F3" />
              </View>
              <Text style={styles.paymentText}>{method.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  billCard: {
    padding: 20,
    margin: 16,
    borderRadius: 12,
    elevation: 2,
  },
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  billIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  billType: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  provider: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  subscriberNo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  amountContainer: {
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  dueDate: {
    fontSize: 14,
    color: '#F44336',
    fontWeight: '500',
  },
  detailsSection: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  periodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  periodItem: {
    flex: 1,
  },
  periodLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  periodValue: {
    fontSize: 14,
    color: '#333',
  },
  readingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  readingItem: {
    flex: 1,
  },
  readingLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  readingValue: {
    fontSize: 14,
    color: '#333',
  },
  breakdownContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 16,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#666',
  },
  breakdownValue: {
    fontSize: 14,
    color: '#333',
  },
  totalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  paymentSection: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 16,
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentButton: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default BillDetailScreen; 