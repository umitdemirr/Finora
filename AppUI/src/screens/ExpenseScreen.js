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

const ExpenseScreen = ({ navigation }) => {
  const [showBalance, setShowBalance] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const expenseData = [
    {
      id: 1,
      title: 'Market Alışverişi',
      amount: 450.75,
      date: '2024-03-15',
      category: 'groceries',
      account: 'Ziraat Bankası',
      description: 'Haftalık market alışverişi',
    },
    {
      id: 2,
      title: 'Elektrik Faturası',
      amount: 285.50,
      date: '2024-03-10',
      category: 'bills',
      account: 'Garanti',
      description: 'Mart ayı elektrik faturası',
    },
    {
      id: 3,
      title: 'Akaryakıt',
      amount: 1200.00,
      date: '2024-03-12',
      category: 'transportation',
      account: 'İş Bankası',
      description: 'Araç yakıt dolumu',
    },
  ];

  const categories = [
    { id: 'groceries', name: 'Market', icon: 'cart' },
    { id: 'bills', name: 'Faturalar', icon: 'file-document' },
    { id: 'transportation', name: 'Ulaşım', icon: 'car' },
    { id: 'entertainment', name: 'Eğlence', icon: 'movie' },
    { id: 'health', name: 'Sağlık', icon: 'medical-bag' },
    { id: 'other', name: 'Diğer', icon: 'dots-horizontal' },
  ];

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.icon : 'help-circle';
  };

  const renderExpenseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.expenseCard}
      onPress={() => navigation.navigate('ExpenseDetail', { expense: item })}
    >
      <View style={styles.expenseHeader}>
        <View style={styles.categoryIcon}>
          <Icon name={getCategoryIcon(item.category)} size={24} color="#F44336" />
        </View>
        <View style={styles.expenseInfo}>
          <Text style={styles.expenseTitle}>{item.title}</Text>
          <Text style={styles.expenseAccount}>{item.account}</Text>
        </View>
        <Text style={styles.expenseAmount}>
          {showBalance 
            ? `-₺${item.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` 
            : '••••••'
          }
        </Text>
      </View>
      <View style={styles.expenseFooter}>
        <Text style={styles.expenseDate}>{item.date}</Text>
        <Text style={styles.expenseDescription} numberOfLines={1}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.totalLabel}>Toplam Gider (Bu Ay)</Text>
        <View style={styles.totalContainer}>
          <Text style={styles.totalAmount}>
            {showBalance 
              ? `-₺${expenseData.reduce((sum, item) => sum + item.amount, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` 
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

      <View style={styles.categoryList}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.categoryButton}>
              <View style={styles.categoryIconSmall}>
                <Icon name={item.icon} size={20} color="#F44336" />
              </View>
              <Text style={styles.categoryName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={expenseData}
        renderItem={renderExpenseItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('AddExpense')}
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
    color: '#F44336',
  },
  categoryList: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    marginBottom: 8,
    elevation: 2,
  },
  categoryContainer: {
    paddingHorizontal: 12,
  },
  categoryButton: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  categoryIconSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  expenseCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  expenseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  expenseAccount: {
    fontSize: 12,
    color: '#666',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F44336',
  },
  expenseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseDate: {
    fontSize: 12,
    color: '#666',
  },
  expenseDescription: {
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
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});

export default ExpenseScreen; 