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
import { StockTransactionsStyles as styles } from '../../styles/globalStyles';

const StockTransactionsScreen = ({ route, navigation }) => {
  const { account } = route.params; // StockAccountsScreen'den gelen hesap bilgisi
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filter, setFilter] = useState('ALL'); // ALL, BUY, SELL
  const [summary, setSummary] = useState({
    totalBuy: 0,
    totalSell: 0,
    totalQuantityBought: 0,
    totalQuantitySold: 0,
    totalTransactions: 0,
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, filter]);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/StockTransaction/getall');
      
      if (response.data && response.data.data) {
        const allTransactions = response.data.data;
        
        // Bu hesaba ait işlemleri filtrele
        const accountTransactions = allTransactions.filter(
          transaction => transaction.stockAccountId === account.id
        );
        
        setTransactions(accountTransactions);
        calculateSummary(accountTransactions);
      } else {
        setTransactions([]);
        setFilteredTransactions([]);
      }
    } catch (error) {
      console.error('Hisse senedi işlemleri alınamadı:', error);
      Alert.alert('Hata', 'İşlem bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterTransactions = () => {
    let filtered = transactions;
    
    if (filter === 'BUY') {
      filtered = transactions.filter(t => t.type === 'BUY');
    } else if (filter === 'SOLD') {
      filtered = transactions.filter(t => t.type === 'SOLD');
    }
    
    // Tarihe göre sırala (en yeni önce)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setFilteredTransactions(filtered);
  };

  const calculateSummary = (transactionList) => {
    const buyTransactions = transactionList.filter(t => t.type === 'BUY');
    const sellTransactions = transactionList.filter(t => t.type === 'SOLD');
    
    const totalBuy = buyTransactions.reduce((sum, t) => sum + (t.price * t.quantity), 0);
    const totalSell = sellTransactions.reduce((sum, t) => sum + (t.price * t.quantity), 0);
    const totalQuantityBought = buyTransactions.reduce((sum, t) => sum + t.quantity, 0);
    const totalQuantitySold = sellTransactions.reduce((sum, t) => sum + t.quantity, 0);
    
    setSummary({
      totalBuy,
      totalSell,
      totalQuantityBought,
      totalQuantitySold,
      totalTransactions: transactionList.length,
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type) => {
    return type === 'BUY' ? 'arrow-up-circle' : 'arrow-down-circle';
  };

  const getTransactionColor = (type) => {
    return type === 'BUY' ? '#10B981' : '#EF4444';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Filled': return '#10B981';
      case 'Pending': return '#F59E0B';
      case 'Cancelled': return '#EF4444';
      default: return '#64748B';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Filled': return 'check-circle';
      case 'Pending': return 'clock-outline';
      case 'Cancelled': return 'close-circle';
      default: return 'help-circle';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>İşlemler yükleniyor...</Text>
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
        {/* Header - Hesap Bilgisi */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>📊 İşlem Geçmişi</Text>
          <View style={styles.accountInfoCard}>
            <Text style={styles.accountLabel}>🏦 Hesap: #{account.accountNo}</Text>
            <Text style={styles.accountBalance}>
              💰 {formatCurrency(account.balance, account.currency)}
            </Text>
            <Text style={styles.exchangeInfo}>
              🏢 {account.exchangeName || `Exchange ${account.exchangeId}`}
            </Text>
          </View>
        </View>

        {/* Özet Kartları */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryGrid}>
            <View style={[styles.summaryCard, styles.buyCard]}>
              <Icon name="arrow-up-circle" size={32} color="#10B981" />
              <Text style={styles.summaryValue}>{formatCurrency(summary.totalBuy, account.currency)}</Text>
              <Text style={styles.summaryLabel}>Toplam Alış</Text>
              <Text style={styles.summarySubLabel}>{summary.totalQuantityBought} adet</Text>
            </View>
            
            <View style={[styles.summaryCard, styles.sellCard]}>
              <Icon name="arrow-down-circle" size={32} color="#EF4444" />
              <Text style={styles.summaryValue}>{formatCurrency(summary.totalSell, account.currency)}</Text>
              <Text style={styles.summaryLabel}>Toplam Satış</Text>
              <Text style={styles.summarySubLabel}>{summary.totalQuantitySold} adet</Text>
            </View>
          </View>
          
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>📈 Net Pozisyon</Text>
            <Text style={[styles.totalValue, { 
              color: (summary.totalSell - summary.totalBuy) >= 0 ? '#10B981' : '#EF4444' 
            }]}>
              {(summary.totalSell - summary.totalBuy) >= 0 ? '+' : ''}
              {formatCurrency(summary.totalSell - summary.totalBuy, account.currency)}
            </Text>
            <Text style={styles.totalSubLabel}>
              {summary.totalTransactions} toplam işlem
            </Text>
          </View>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'ALL' && styles.filterButtonActive]}
            onPress={() => setFilter('ALL')}
          >
            <Text style={[styles.filterButtonText, filter === 'ALL' && styles.filterButtonTextActive]}>
              Tümü ({transactions.length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'BUY' && styles.filterButtonActive]}
            onPress={() => setFilter('BUY')}
          >
            <Text style={[styles.filterButtonText, filter === 'BUY' && styles.filterButtonTextActive]}>
              Alış ({transactions.filter(t => t.type === 'BUY').length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'SOLD' && styles.filterButtonActive]}
            onPress={() => setFilter('SOLD')}
          >
            <Text style={[styles.filterButtonText, filter === 'SOLD' && styles.filterButtonTextActive]}>
              Satış ({transactions.filter(t => t.type === 'SOLD').length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* İşlem Listesi */}
        <View style={styles.transactionsContainer}>
          {filteredTransactions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="chart-line-variant" size={80} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>📊 İşlem Bulunamadı</Text>
              <Text style={styles.emptyText}>
                {filter === 'ALL' 
                  ? 'Bu hesapta henüz hiç işlem yapılmamış.'
                  : `${filter === 'BUY' ? 'Alış' : 'Satış'} işlemi bulunamadı.`
                }
              </Text>
            </View>
          ) : (
            filteredTransactions.map((transaction, index) => (
              <TouchableOpacity
                key={`transaction-${transaction.id}-${index}`}
                style={styles.transactionCard}
                onPress={() => {
                  Alert.alert('📊 İşlem Detayı', 
                    `📈 ${transaction.name} (${transaction.stockSymbol})\n` +
                    `📋 İşlem Tipi: ${transaction.type === 'BUY' ? 'Alış' : 'Satış'}\n` +
                    `💰 Fiyat: ${formatCurrency(transaction.price, account.currency)}\n` +
                    `📦 Miktar: ${transaction.quantity} adet\n` +
                    `💎 Toplam: ${formatCurrency(transaction.price * transaction.quantity, account.currency)}\n` +
                    `📅 Tarih: ${formatDate(transaction.date)}\n` +
                    `✅ Durum: ${transaction.status}\n` +
                    `🏷️ Varlık Tipi: ${transaction.assetType}`
                  );
                }}
              >
                {/* İşlem Header */}
                <View style={styles.transactionHeader}>
                  <View style={styles.transactionLeft}>
                    <View style={[styles.transactionIcon, { backgroundColor: getTransactionColor(transaction.type) + '20' }]}>
                      <Icon 
                        name={getTransactionIcon(transaction.type)} 
                        size={24} 
                        color={getTransactionColor(transaction.type)} 
                      />
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.stockSymbol}>{transaction.stockSymbol}</Text>
                      <Text style={styles.stockName}>{transaction.name}</Text>
                      <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.statusBadge}>
                    <Icon 
                      name={getStatusIcon(transaction.status)} 
                      size={16} 
                      color={getStatusColor(transaction.status)} 
                    />
                    <Text style={[styles.statusText, { color: getStatusColor(transaction.status) }]}>
                      {transaction.status}
                    </Text>
                  </View>
                </View>

                {/* İşlem Detayları */}
                <View style={styles.transactionDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>💰 Birim Fiyat:</Text>
                    <Text style={styles.detailValue}>{formatCurrency(transaction.price, account.currency)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>📦 Miktar:</Text>
                    <Text style={styles.detailValue}>{transaction.quantity} adet</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>💎 Toplam:</Text>
                    <Text style={[styles.detailValue, styles.totalAmount, { 
                      color: getTransactionColor(transaction.type) 
                    }]}>
                      {formatCurrency(transaction.price * transaction.quantity, account.currency)}
                    </Text>
                  </View>
                </View>

                {/* İşlem Tipi Badge */}
                <View style={[styles.typeBadge, { 
                  backgroundColor: getTransactionColor(transaction.type) + '15',
                  borderColor: getTransactionColor(transaction.type) + '40'
                }]}>
                  <Text style={[styles.typeText, { color: getTransactionColor(transaction.type) }]}>
                    {transaction.type === 'BUY' ? '🛒 ALIŞ' : '💸 SATIŞ'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default StockTransactionsScreen; 