import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const IncomeScreen = ({ navigation }) => {
  const [showBalance, setShowBalance] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const incomeData = [
    {
      id: 1,
      title: 'Maaş',
      amount: 12500.00,
      date: '2024-03-01',
      category: 'salary',
      account: 'Ziraat Bankası',
      description: 'Mart ayı maaş ödemesi',
    },
    {
      id: 2,
      title: 'Kira Geliri',
      amount: 5000.00,
      date: '2024-03-05',
      category: 'rent',
      account: 'İş Bankası',
      description: 'Mart ayı kira geliri',
    },
    {
      id: 3,
      title: 'Freelance Proje',
      amount: 3500.00,
      date: '2024-03-10',
      category: 'freelance',
      account: 'Garanti',
      description: 'Web tasarım projesi ödemesi',
    },
  ];

  const categories = [
    { id: 'salary', name: 'Maaş', icon: 'cash-multiple' },
    { id: 'rent', name: 'Kira', icon: 'home-city' },
    { id: 'freelance', name: 'Freelance', icon: 'laptop' },
    { id: 'investment', name: 'Yatırım', icon: 'chart-line' },
    { id: 'other', name: 'Diğer', icon: 'plus-circle' },
  ];

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.icon : 'help-circle';
  };

  const renderIncomeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.incomeCard}
      onPress={() => navigation.navigate('IncomeDetail', { income: item })}
    >
      <View style={styles.incomeHeader}>
        <View style={styles.categoryIcon}>
          <Icon name={getCategoryIcon(item.category)} size={24} color="#4CAF50" />
        </View>
        <View style={styles.incomeInfo}>
          <Text style={styles.incomeTitle}>{item.title}</Text>
          <Text style={styles.incomeAccount}>{item.account}</Text>
        </View>
        <Text style={styles.incomeAmount}>
          {showBalance 
            ? `₺${item.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` 
            : '••••••'
          }
        </Text>
      </View>
      <View style={styles.incomeFooter}>
        <Text style={styles.incomeDate}>{item.date}</Text>
        <Text style={styles.incomeDescription} numberOfLines={1}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.totalLabel}>Toplam Gelir (Bu Ay)</Text>
        <View style={styles.totalContainer}>
          <Text style={styles.totalAmount}>
            {showBalance 
              ? `₺${incomeData.reduce((sum, item) => sum + item.amount, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` 
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

      <FlatList
        data={incomeData}
        renderItem={renderIncomeItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('AddIncome')}
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
    color: '#4CAF50',
  },
  listContainer: {
    padding: 16,
  },
  incomeCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  incomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  incomeInfo: {
    flex: 1,
  },
  incomeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  incomeAccount: {
    fontSize: 12,
    color: '#666',
  },
  incomeAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  incomeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  incomeDate: {
    fontSize: 12,
    color: '#666',
  },
  incomeDescription: {
    fontSize: 12,
    color: '#666',
    flex: 1,
    textAlign: 'right',
    marginLeft: 8,
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});

export default IncomeScreen; 