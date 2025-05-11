import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PieChart } from 'react-native-chart-kit';

const BudgetScreen = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('income'); // 'income' veya 'expense'
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const [budget, setBudget] = useState({
    income: [
      { category: 'Maaş', amount: 15000, color: '#00b341', icon: 'cash' },
      { category: 'Ek Gelir', amount: 2500, color: '#4CAF50', icon: 'cash-plus' },
      { category: 'Kira Geliri', amount: 3000, color: '#8BC34A', icon: 'home' },
    ],
    expenses: [
      { category: 'Kira', amount: 4000, color: '#FF5252', icon: 'home' },
      { category: 'Market', amount: 3000, color: '#FF7043', icon: 'cart' },
      { category: 'Faturalar', amount: 1500, color: '#FF9800', icon: 'file-document' },
      { category: 'Ulaşım', amount: 800, color: '#FFC107', icon: 'car' },
      { category: 'Eğlence', amount: 1000, color: '#FFEB3B', icon: 'movie' },
    ],
  });

  const totalIncome = budget.income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = budget.expenses.reduce((sum, item) => sum + item.amount, 0);
  const balance = totalIncome - totalExpenses;

  const handleAddItem = () => {
    if (!newAmount || !newCategory) {
      Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun.');
      return;
    }

    const amount = parseFloat(newAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Uyarı', 'Geçerli bir miktar girin.');
      return;
    }

    const newItem = {
      category: newCategory,
      amount: amount,
      color: modalType === 'income' ? '#00b341' : '#FF5252',
      icon: modalType === 'income' ? 'cash' : 'cash-minus',
    };

    setBudget(prev => ({
      ...prev,
      [modalType]: [...prev[modalType], newItem],
    }));

    setShowAddModal(false);
    setNewAmount('');
    setNewCategory('');
  };

  const renderPieChart = (data) => {
    const chartData = data.map((item) => ({
      name: item.category,
      amount: item.amount,
      color: item.color,
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    }));

    return (
      <PieChart
        data={chartData}
        width={Dimensions.get('window').width - 40}
        height={220}
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Üst Bilgi Kartı */}
      <View style={styles.summaryCard}>
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={() => {/* Önceki ay */}}>
            <Icon name="chevron-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {months[selectedMonth]} {selectedYear}
          </Text>
          <TouchableOpacity onPress={() => {/* Sonraki ay */}}>
            <Icon name="chevron-right" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceTitle}>Net Durum</Text>
          <Text style={[styles.balanceAmount, { color: balance >= 0 ? '#00b341' : '#FF5252' }]}>
            {balance.toLocaleString('tr-TR')} ₺
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Toplam Gelir</Text>
            <Text style={[styles.summaryAmount, styles.incomeText]}>
              {totalIncome.toLocaleString('tr-TR')} ₺
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Toplam Gider</Text>
            <Text style={[styles.summaryAmount, styles.expenseText]}>
              {totalExpenses.toLocaleString('tr-TR')} ₺
            </Text>
          </View>
        </View>
      </View>

      {/* Gelirler Bölümü */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Gelirler</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setModalType('income');
              setShowAddModal(true);
            }}
          >
            <Icon name="plus" size={20} color="#007AFF" />
            <Text style={styles.addButtonText}>Gelir Ekle</Text>
          </TouchableOpacity>
        </View>
        {renderPieChart(budget.income)}
        {budget.income.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <View style={styles.itemLeft}>
              <View style={[styles.itemIcon, { backgroundColor: item.color + '20' }]}>
                <Icon name={item.icon} size={24} color={item.color} />
              </View>
              <Text style={styles.itemCategory}>{item.category}</Text>
            </View>
            <Text style={[styles.itemAmount, styles.incomeText]}>
              {item.amount.toLocaleString('tr-TR')} ₺
            </Text>
          </View>
        ))}
      </View>

      {/* Giderler Bölümü */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Giderler</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setModalType('expenses');
              setShowAddModal(true);
            }}
          >
            <Icon name="plus" size={20} color="#007AFF" />
            <Text style={styles.addButtonText}>Gider Ekle</Text>
          </TouchableOpacity>
        </View>
        {renderPieChart(budget.expenses)}
        {budget.expenses.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <View style={styles.itemLeft}>
              <View style={[styles.itemIcon, { backgroundColor: item.color + '20' }]}>
                <Icon name={item.icon} size={24} color={item.color} />
              </View>
              <Text style={styles.itemCategory}>{item.category}</Text>
            </View>
            <Text style={[styles.itemAmount, styles.expenseText]}>
              {item.amount.toLocaleString('tr-TR')} ₺
            </Text>
          </View>
        ))}
      </View>

      {/* Ekleme Modalı */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modalType === 'income' ? 'Gelir Ekle' : 'Gider Ekle'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Kategori"
              value={newCategory}
              onChangeText={setNewCategory}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Miktar"
              value={newAmount}
              onChangeText={setNewAmount}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddItem}
              >
                <Text style={styles.saveButtonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  summaryCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  incomeText: {
    color: '#00b341',
  },
  expenseText: {
    color: '#FF5252',
  },
  section: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f8ff',
  },
  addButtonText: {
    color: '#007AFF',
    marginLeft: 4,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemCategory: {
    fontSize: 16,
    color: '#333',
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 20,
    borderRadius: 16,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BudgetScreen; 