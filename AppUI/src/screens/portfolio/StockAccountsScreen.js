import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { StockAccountsStyles as styles } from '../../styles/globalStyles';

const StockAccountsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stockAccounts, setStockAccounts] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    fetchStockAccounts();
  }, []);

  const fetchStockAccounts = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Hata', 'Kullanıcı bilgileri alınamadı');
        return;
      }

      const response = await api.get(`/StockAcount/getdetailbyuserid?userId=${userId}`);
      
      if (response.data && response.data.data) {
        const accountsData = response.data.data;
        setStockAccounts(accountsData);
        
        // Toplam bakiye hesapla
        const total = accountsData.reduce((sum, account) => sum + account.balance, 0);
        setTotalBalance(total);
      } else {
        setStockAccounts([]);
        setTotalBalance(0);
      }
    } catch (error) {
      console.error('Hisse senedi hesapları alınamadı:', error);
      Alert.alert('Hata', 'Hesap bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchStockAccounts();
  };

  const formatCurrency = (amount, currency = 'TRY') => {
    if (isNaN(amount)) return '₺0,00';
    const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₺';
    return symbol + Number(amount).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCurrencyIcon = (currency) => {
    switch (currency) {
      case 'USD': return 'currency-usd';
      case 'EUR': return 'currency-eur';
      case 'TRY': return 'currency-try';
      default: return 'currency-try';
    }
  };

  const getCurrencyColor = (currency) => {
    switch (currency) {
      case 'USD': return '#10B981';
      case 'EUR': return '#3B82F6';
      case 'TRY': return '#EF4444';
      default: return '#64748B';
    }
  };

  const getExchangeName = (exchangeId, exchangeName) => {
    // API'den gelen exchangeName varsa onu kullan, yoksa varsayılan mapping
    if (exchangeName) {
      return exchangeName;
    }
    
    const exchanges = {
      23: 'Borsa İstanbul',
      24: 'NASDAQ',
      25: 'NYSE',
      15: 'YapıKredi Bankası',
    };
    return exchanges[exchangeId] || `Exchange ${exchangeId}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Hesaplar yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header - Toplam Bakiye */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>💼 Hisse Senedi Hesapları</Text>
          <View style={styles.totalBalanceCard}>
            <Text style={styles.totalBalanceLabel}>💰 Toplam Bakiye</Text>
            <Text style={styles.totalBalanceAmount}>{formatCurrency(totalBalance)}</Text>
            <Text style={styles.accountCount}>
              📊 {stockAccounts.length} Hesap
            </Text>
          </View>
        </View>

        {/* Hesap Listesi */}
        <View style={styles.accountsContainer}>
          {stockAccounts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="bank-outline" size={80} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>🏦 Henüz Hesap Yok</Text>
              <Text style={styles.emptyText}>
                Hisse senedi işlemleriniz için bir hesap açmanız gerekiyor. İlk hesabınızı oluşturmak için aşağıdaki butona tıklayın.
              </Text>
              <TouchableOpacity style={styles.addAccountButton}>
                <Icon name="plus" size={24} color="#FFFFFF" />
                <Text style={styles.addAccountButtonText}>Yeni Hesap Ekle</Text>
              </TouchableOpacity>
            </View>
          ) : (
            stockAccounts.map((account, index) => (
              <TouchableOpacity
                key={`account-${account.id}-${index}`}
                style={styles.accountCard}
                onPress={() => {
                  // StockTransactionsScreen'e navigate et
                  navigation.navigate('StockTransactions', { account });
                }}
              >
                {/* Hesap Header */}
                <View style={styles.accountHeader}>
                  <View style={styles.accountIconContainer}>
                    <Icon 
                      name={getCurrencyIcon(account.currency)} 
                      size={28} 
                      color={getCurrencyColor(account.currency)} 
                    />
                  </View>
                  <View style={styles.accountInfo}>
                    <Text style={styles.accountNumber}>#{account.accountNo}</Text>
                    <Text style={styles.exchangeName}>
                      🏢 {getExchangeName(account.exchangeId, account.exchangeName)}
                    </Text>
                    <Text style={styles.userName}>
                      👤 {account.userName}
                    </Text>
                  </View>
                  <View style={styles.currencyBadge}>
                    <Text style={[styles.currencyText, { color: getCurrencyColor(account.currency) }]}>
                      {account.currency}
                    </Text>
                  </View>
                </View>

                {/* Bakiye Bilgisi */}
                <View style={styles.balanceContainer}>
                  <Text style={styles.balanceLabel}>💰 Mevcut Bakiye</Text>
                  <Text style={[styles.balanceAmount, { color: getCurrencyColor(account.currency) }]}>
                    {formatCurrency(account.balance, account.currency)}
                  </Text>
                </View>

                {/* Hesap Detayları */}
                <View style={styles.accountDetails}>
                  <View style={styles.detailItem}>
                    <Icon name="calendar-clock" size={16} color="#64748B" />
                    <Text style={styles.detailText}>
                      Oluşturulma: {formatDate(account.createdAt)}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Icon name="update" size={16} color="#64748B" />
                    <Text style={styles.detailText}>
                      Güncelleme: {formatDate(account.updatedAt)}
                    </Text>
                  </View>
                </View>

                {/* Performans Göstergesi */}
                <View style={styles.performanceIndicator}>
                  <Icon name="trending-up" size={16} color="#10B981" />
                  <Text style={styles.performanceText}>Aktif Hesap</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};
export default StockAccountsScreen; 