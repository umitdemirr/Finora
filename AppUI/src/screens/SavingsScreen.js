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

const SavingsScreen = ({ navigation }) => {
  const [showBalance, setShowBalance] = useState(true);

  const savingsGoals = [
    {
      id: 1,
      title: 'Araba',
      targetAmount: 250000.00,
      currentAmount: 75000.00,
      deadline: '2024-12-31',
      icon: 'car',
      color: '#E3F2FD',
      monthlyTarget: 15000.00,
    },
    {
      id: 2,
      title: 'Tatil',
      targetAmount: 30000.00,
      currentAmount: 12500.00,
      deadline: '2024-08-15',
      icon: 'beach',
      color: '#FFF3E0',
      monthlyTarget: 3500.00,
    },
    {
      id: 3,
      title: 'Teknoloji',
      targetAmount: 15000.00,
      currentAmount: 8750.00,
      deadline: '2024-06-30',
      icon: 'laptop',
      color: '#E8F5E9',
      monthlyTarget: 2500.00,
    },
  ];

  const quickActions = [
    { id: 'add', name: 'Yeni Hedef', icon: 'plus-circle' },
    { id: 'transfer', name: 'Para Ekle', icon: 'cash-plus' },
    { id: 'withdraw', name: 'Para Çek', icon: 'cash-minus' },
    { id: 'stats', name: 'İstatistikler', icon: 'chart-line' },
  ];

  const calculateProgress = (current, target) => {
    return (current / target) * 100;
  };

  const renderSavingsGoal = ({ item }) => {
    const progress = calculateProgress(item.currentAmount, item.targetAmount);
    
    return (
      <TouchableOpacity
        style={[styles.goalCard, { backgroundColor: item.color }]}
        onPress={() => navigation.navigate('SavingsDetail', { goal: item })}
      >
        <View style={styles.goalHeader}>
          <View style={styles.goalIconContainer}>
            <Icon name={item.icon} size={24} color="#2196F3" />
          </View>
          <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
            <Icon 
              name={showBalance ? 'eye-outline' : 'eye-off-outline'} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.goalTitle}>{item.title}</Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${progress}%` }
              ]}
            />
          </View>
          <Text style={styles.progressText}>{`${Math.round(progress)}%`}</Text>
        </View>

        <View style={styles.amountsContainer}>
          <View style={styles.amountItem}>
            <Text style={styles.amountLabel}>Mevcut</Text>
            <Text style={styles.amountValue}>
              {showBalance 
                ? `₺${item.currentAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` 
                : '••••••'
              }
            </Text>
          </View>
          <View style={styles.amountItem}>
            <Text style={styles.amountLabel}>Hedef</Text>
            <Text style={styles.amountValue}>
              {showBalance 
                ? `₺${item.targetAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` 
                : '••••••'
              }
            </Text>
          </View>
        </View>

        <View style={styles.goalFooter}>
          <Text style={styles.monthlyTarget}>
            Aylık Hedef: {showBalance 
              ? `₺${item.monthlyTarget.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` 
              : '••••••'
            }
          </Text>
          <Text style={styles.deadline}>Bitiş: {item.deadline}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.totalLabel}>Toplam Birikim</Text>
        <View style={styles.totalContainer}>
          <Text style={styles.totalAmount}>
            {showBalance 
              ? `₺${savingsGoals
                  .reduce((sum, goal) => sum + goal.currentAmount, 0)
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

      <View style={styles.quickActions}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActionsContainer}
        >
          {quickActions.map(action => (
            <TouchableOpacity 
              key={action.id}
              style={styles.actionButton}
              onPress={() => {
                switch(action.id) {
                  case 'add':
                    navigation.navigate('AddSavingsGoal');
                    break;
                  case 'transfer':
                    navigation.navigate('AddMoney');
                    break;
                  case 'withdraw':
                    navigation.navigate('WithdrawMoney');
                    break;
                  case 'stats':
                    navigation.navigate('SavingsStats');
                    break;
                }
              }}
            >
              <View style={styles.actionIcon}>
                <Icon name={action.icon} size={24} color="#2196F3" />
              </View>
              <Text style={styles.actionText}>{action.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.goalsList}>
        <Text style={styles.sectionTitle}>Birikim Hedeflerim</Text>
        <FlatList
          data={savingsGoals}
          renderItem={renderSavingsGoal}
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
  quickActions: {
    backgroundColor: '#FFF',
    paddingVertical: 16,
    marginTop: 8,
    elevation: 2,
  },
  quickActionsContainer: {
    paddingHorizontal: 16,
  },
  actionButton: {
    alignItems: 'center',
    marginRight: 24,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#666',
  },
  goalsList: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  goalCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#FFF',
    borderRadius: 4,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    width: 40,
    textAlign: 'right',
  },
  amountsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  amountItem: {
    flex: 1,
  },
  amountLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthlyTarget: {
    fontSize: 12,
    color: '#666',
  },
  deadline: {
    fontSize: 12,
    color: '#666',
  },
});

export default SavingsScreen; 