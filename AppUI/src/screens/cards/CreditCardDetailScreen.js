import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { CreditCardDetailStyles as styles } from '../../styles/globalStyles';

const CreditCardDetailScreen = ({ route, navigation }) => {
  const { card } = route.params;
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [totalDebt, setTotalDebt] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [cardDetails, setCardDetails] = useState(card);


  useEffect(() => {
    fetchTransactions();
    fetchAccounts();
    
    // Screen'e odaklandığında kartı güncelle
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTransactions();
      refreshCardDetails();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchTransactions = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Hata', 'Kullanıcı bilgileri alınamadı');
        return;
      }

      const response = await api.get(`/BankTransaction/getdetail?userId=${userId}`);
      
      if (response.data.success && response.data.data) {
        const allTransactions = response.data.data;
        
        // Bu kredi kartına ait Debit işlemlerini filtrele
        const cardTransactions = allTransactions.filter(transaction => {
          // Debit işlemleri (kredi kartı borçları)
          if (transaction.transactionType === 'Debit') {
            // accountId bu kredi kartının ID'si ile eşleşiyor mu?
            return transaction.accountId === card.id ||
                   transaction.accountId === cardDetails.id ||
                   Number(transaction.accountId) === Number(card.id) ||
                   String(transaction.accountId) === String(card.id);
          }
          return false;
        });
        
        setTransactions(cardTransactions);
        
        // Toplam borç tutarını hesapla
        const total = cardTransactions.reduce((sum, transaction) => {
          return sum + (parseFloat(transaction.amount) || 0);
        }, 0);
        setTotalDebt(total);
      }
    } catch (error) {
      console.error('İşlem bilgileri alınamadı:', error);
      Alert.alert('Hata', 'İşlem bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Hata', 'Kullanıcı bilgileri alınamadı');
        return;
      }

      const response = await api.get(`/BankAccount/getdetailbyuserid?userId=${userId}`);
      if (response.data.success && response.data.data) {
        setAccounts(response.data.data);
      }
    } catch (error) {
      console.error('Hesap bilgileri alınamadı:', error);
      Alert.alert('Hata', 'Hesap bilgileri yüklenirken bir hata oluştu');
    }
  };

  const formatCurrency = (amount) => {
    if (isNaN(amount)) return '₺0,00';
    return '₺' + Number(amount).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };

  const refreshCardDetails = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      const response = await api.get(`/CreditCard/getdetail?userId=${userId}`);
      if (response.data.success && response.data.data) {
        const updatedCard = response.data.data.find(c => c.id === card.id);
        if (updatedCard) {
          setCardDetails(updatedCard);
        }
      }
    } catch (error) {
      console.error('Kart bilgileri güncellenemedi:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Kart Bilgileri */}
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>{cardDetails.name}</Text>
            <Text style={styles.cardNumber}>**** **** **** {cardDetails.cardNumber.slice(-4)}</Text>
          </View>
        </View>

        {/* Kart Detayları */}
        <View style={styles.cardDetails}>
          <View style={styles.cardDetailItem}>
            <Text style={styles.cardDetailLabel}>Ekstre Kesim Tarihi</Text>
            <Text style={styles.cardDetailValue}>{cardDetails.statementClosingDate}. Gün</Text>
          </View>
          <View style={styles.cardDetailItem}>
            <Text style={styles.cardDetailLabel}>Kart Limiti</Text>
            <Text style={styles.cardDetailValue}>{formatCurrency(cardDetails.limit)}</Text>
          </View>
          <View style={styles.cardDetailItem}>
            <Text style={styles.cardDetailLabel}>Kullanılabilir Limit</Text>
            <Text style={styles.cardDetailValue}>{formatCurrency(cardDetails.avaliableLimit)}</Text>
          </View>
        </View>

        {/* Toplam Borç */}
        <View style={styles.totalDebtContainer}>
          <Text style={styles.totalDebtLabel}>Toplam Borç</Text>
          <Text style={styles.totalDebtAmount}>{formatCurrency(totalDebt)}</Text>
        </View>

        {/* Borç İşlemleri */}
        <View style={styles.debtsContainer}>
          <Text style={styles.sectionTitle}>Borç İşlemleri</Text>
          {transactions.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Icon name="credit-card-outline" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>Bu karta ait borç işlemi bulunmuyor</Text>
              <Text style={styles.emptyStateSubText}>Kredi kartınızla yaptığınız harcamalar burada görünecektir</Text>
            </View>
          ) : (
            transactions.map((transaction) => (
              <TouchableOpacity
                key={`debt-main-${transaction.bankTransactionId || transaction.id}`}
                style={styles.debtItem}
                onPress={() => Alert.alert('İşlem Detayı', 
                  `Açıklama: ${transaction.description}\nTarih: ${formatDate(transaction.transactionDate)}\nKategori: ${transaction.category}\nTutar: ${formatCurrency(transaction.amount)}`
                )}
              >
                <View style={styles.debtLeft}>
                  <View style={styles.debtIcon}>
                    <Icon 
                      name="credit-card-outline" 
                      size={20} 
                      color="#F44336" 
                    />
                  </View>
                  <View style={styles.debtInfo}>
                    <Text style={styles.debtTitle}>{transaction.description}</Text>
                    <Text style={styles.debtDate}>{formatDate(transaction.transactionDate)}</Text>
                    <Text style={styles.debtCategory}>{transaction.category}</Text>
                  </View>
                </View>
                <Text style={styles.debtAmount}>{formatCurrency(transaction.amount)}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default CreditCardDetailScreen; 