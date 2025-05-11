import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PaymentsScreen = () => {
  const bills = [
    {
      id: '1',
      type: 'Elektrik',
      icon: 'flash',
      amount: 245.30,
      dueDate: '28 Mart 2024',
    },
    {
      id: '2',
      type: 'Su',
      icon: 'water',
      amount: 120.50,
      dueDate: '30 Mart 2024',
    },
    {
      id: '3',
      type: 'Doğalgaz',
      icon: 'fire',
      amount: 380.75,
      dueDate: '1 Nisan 2024',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={24} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Fatura veya kurum ara..."
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Kategoriler</Text>
        <View style={styles.categories}>
          <TouchableOpacity style={styles.categoryButton}>
            <Icon name="home" size={24} color="#007AFF" />
            <Text style={styles.categoryText}>Ev</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}>
            <Icon name="cellphone" size={24} color="#007AFF" />
            <Text style={styles.categoryText}>Telefon</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}>
            <Icon name="wifi" size={24} color="#007AFF" />
            <Text style={styles.categoryText}>İnternet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}>
            <Icon name="dots-horizontal" size={24} color="#007AFF" />
            <Text style={styles.categoryText}>Diğer</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.billsContainer}>
        <Text style={styles.sectionTitle}>Bekleyen Faturalar</Text>
        {bills.map((bill) => (
          <TouchableOpacity key={bill.id} style={styles.billCard}>
            <View style={styles.billLeft}>
              <View style={styles.billIcon}>
                <Icon name={bill.icon} size={24} color="#007AFF" />
              </View>
              <View>
                <Text style={styles.billType}>{bill.type}</Text>
                <Text style={styles.billDate}>Son Ödeme: {bill.dueDate}</Text>
              </View>
            </View>
            <View style={styles.billRight}>
              <Text style={styles.billAmount}>₺{bill.amount.toFixed(2)}</Text>
              <TouchableOpacity style={styles.payButton}>
                <Text style={styles.payButtonText}>Öde</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.recentPayments}>
        <Text style={styles.sectionTitle}>Son Ödemeler</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>Tümünü Gör</Text>
          <Icon name="chevron-right" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    margin: 20,
    padding: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  categoriesContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    width: '22%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryText: {
    marginTop: 8,
    fontSize: 12,
    color: '#333',
  },
  billsContainer: {
    padding: 20,
  },
  billCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  billLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  billIcon: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
  },
  billType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  billDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  billRight: {
    alignItems: 'flex-end',
  },
  billAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  payButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  payButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  recentPayments: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: '#007AFF',
    marginRight: 4,
  },
});

export default PaymentsScreen; 