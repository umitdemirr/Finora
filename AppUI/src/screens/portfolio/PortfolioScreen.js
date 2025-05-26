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
import { PortfolioStyles as styles } from '../../styles/globalStyles';

const PortfolioScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [assets, setAssets] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalGainLoss, setTotalGainLoss] = useState(0);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await api.get('/Asset/getall');
      
      if (response.data && response.data.data) {
        const assetsData = response.data.data;
        setAssets(assetsData);
        
        // Portföy özetini hesapla
        calculatePortfolioSummary(assetsData);
      } else {
        setAssets([]);
        setTotalValue(0);
        setTotalCost(0);
        setTotalGainLoss(0);
      }
    } catch (error) {
      console.error('Varlık bilgileri alınamadı:', error);
      Alert.alert('Hata', 'Portföy bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const calculatePortfolioSummary = (assetsData) => {
    let totalPortfolioValue = 0;
    let totalPortfolioCost = 0;
    let totalPortfolioGainLoss = 0;
    
    assetsData.forEach(asset => {
      // Güncel değer = kalan adet * ortalama alış fiyatı + kar/zarar
      const currentValue = (asset.kalanAdet * asset.ortalamaAlis) + asset.karZarar;
      const cost = asset.alisToplam - asset.satisToplam; // Net maliyet
      
      totalPortfolioValue += currentValue;
      totalPortfolioCost += cost;
      totalPortfolioGainLoss += asset.karZarar;
    });
    
    setTotalValue(totalPortfolioValue);
    setTotalCost(totalPortfolioCost);
    setTotalGainLoss(totalPortfolioGainLoss);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAssets();
  };

  const formatCurrency = (amount) => {
    if (isNaN(amount)) return '₺0,00';
    return '₺' + Number(amount).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatPercentage = (percentage) => {
    if (isNaN(percentage)) return '0,00%';
    return percentage.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
  };

  const getGainLossColor = (amount) => {
    if (amount > 0) return '#10B981';
    if (amount < 0) return '#EF4444';
    return '#64748B';
  };

  const getCurrentValue = (asset) => {
    return (asset.kalanAdet * asset.ortalamaAlis) + asset.karZarar;
  };

  const getPerformanceIcon = (gainLoss) => {
    if (gainLoss > 0) return 'trending-up';
    if (gainLoss < 0) return 'trending-down';
    return 'trending-neutral';
  };

  const getPerformanceBadge = (gainLoss, percentage) => {
    if (gainLoss > 0) {
      return (
        <View style={[styles.statusBadge, styles.profitBadge]}>
          <Text style={[styles.statusBadgeText, styles.profitBadgeText]}>
            +{formatPercentage(percentage)}
          </Text>
        </View>
      );
    } else if (gainLoss < 0) {
      return (
        <View style={[styles.statusBadge, styles.lossBadge]}>
          <Text style={[styles.statusBadgeText, styles.lossBadgeText]}>
            {formatPercentage(percentage)}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={[styles.statusBadge, styles.neutralBadge]}>
          <Text style={[styles.statusBadgeText, styles.neutralBadgeText]}>
            {formatPercentage(percentage)}
          </Text>
        </View>
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Portföy yükleniyor...</Text>
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
        {/* Portföy Özeti - Enhanced Header */}
        <View style={styles.summaryContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <Text style={styles.summaryTitle}>💼 Portföy Özeti</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity 
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 12,
                  padding: 8,
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                }}
                onPress={() => navigation.navigate('AddStockTransaction')}
              >
                <Icon name="plus" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 12,
                  padding: 8,
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                }}
                onPress={() => navigation.navigate('StockAccounts')}
              >
                <Icon name="bank" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 12,
                  padding: 8,
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                }}
                onPress={() => navigation.navigate('PortfolioAiAnalysis')}
              >
                <Icon name="brain" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>💰 Toplam Değer</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totalValue)}</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>📊 Toplam Maliyet</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totalCost)}</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>
                {totalGainLoss >= 0 ? '📈' : '📉'} Toplam Kar/Zarar
              </Text>
              <Text style={[styles.summaryValue, { color: getGainLossColor(totalGainLoss) }]}>
                {totalGainLoss >= 0 ? '+' : ''}{formatCurrency(totalGainLoss)}
              </Text>
              <Text style={[styles.summaryPercentage, { color: getGainLossColor(totalGainLoss) }]}>
                ({totalGainLoss >= 0 ? '+' : ''}{formatPercentage(totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0)})
              </Text>
            </View>
          </View>
        </View>

        {/* Portföy Listesi - Enhanced Cards */}
        <View style={styles.portfolioContainer}>
          <Text style={styles.sectionTitle}>
            📈 Portföyüm ({assets.filter(asset => asset.kalanAdet > 0).length} Hisse)
          </Text>
          
          {assets.filter(asset => asset.kalanAdet > 0).length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="chart-line-variant" size={80} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>🚀 Portföyünüz Boş</Text>
              <Text style={styles.emptyText}>
                Henüz hiç hisse senedi yatırımınız bulunmuyor. İlk yatırımınızı yapmak için işlem ekleyebilirsiniz.
              </Text>
            </View>
          ) : (
            assets
              .filter(asset => asset.kalanAdet > 0)
              .map((asset, index) => (
                <TouchableOpacity
                  key={`${asset.sembol}-${index}`}
                  style={styles.stockItem}
                  onPress={() => {
                    Alert.alert('📊 Hisse Detayı', 
                      `🏢 ${asset.ad}\n` +
                      `📋 Sembol: ${asset.sembol}\n` +
                      `📦 Kalan Miktar: ${asset.kalanAdet} adet\n` +
                      `💵 Ortalama Alış: ${formatCurrency(asset.ortalamaAlis)}\n` +
                      `💎 Güncel Değer: ${formatCurrency(getCurrentValue(asset))}\n` +
                      `${asset.karZarar >= 0 ? '📈' : '📉'} Kar/Zarar: ${formatCurrency(asset.karZarar)} (${formatPercentage(asset.karZararYuzdesi)})\n` +
                      `🛒 Alınan Toplam: ${asset.alinanAdet} adet - ${formatCurrency(asset.alisToplam)}\n` +
                      `💸 Satılan Toplam: ${asset.satilanAdet} adet - ${formatCurrency(asset.satisToplam)}`
                    );
                  }}
                >
                  {/* Glow Effect */}
                  <View style={styles.stockItemGlow} />
                  
                  <View style={styles.stockLeft}>
                    <View style={styles.stockIcon}>
                      <Icon 
                        name={getPerformanceIcon(asset.karZarar)} 
                        size={28} 
                        color="#3B82F6" 
                      />
                    </View>
                    <View style={styles.stockInfo}>
                      <Text style={styles.stockSymbol}>{asset.sembol}</Text>
                      <Text style={styles.stockName}>{asset.ad}</Text>
                      <Text style={styles.stockQuantity}>📦 {asset.kalanAdet} adet</Text>
                    </View>
                  </View>
                  
                  <View style={styles.stockRight}>
                    <Text style={styles.stockValue}>{formatCurrency(getCurrentValue(asset))}</Text>
                    <Text style={[styles.stockGainLoss, { color: getGainLossColor(asset.karZarar) }]}>
                      {asset.karZarar >= 0 ? '+' : ''}{formatCurrency(asset.karZarar)}
                    </Text>
                    {getPerformanceBadge(asset.karZarar, asset.karZararYuzdesi)}
                  </View>
                </TouchableOpacity>
              ))
          )}
        </View>

        {/* İşlem Özeti - Enhanced */}
        {assets.length > 0 && (
          <View style={styles.transactionsContainer}>
            <Text style={styles.sectionTitle}>📋 İşlem Özeti</Text>
            {assets.map((asset, index) => (
              <View key={`summary-${asset.sembol}-${index}`} style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <View style={[styles.transactionIcon, { backgroundColor: '#EFF6FF', borderWidth: 2, borderColor: '#DBEAFE' }]}>
                    <Icon name="chart-box-outline" size={24} color="#3B82F6" />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionSymbol}>{asset.sembol}</Text>
                    <Text style={styles.transactionType}>
                      🛒 Alış: {asset.alinanAdet} adet | 💸 Satış: {asset.satilanAdet} adet
                    </Text>
                    <Text style={styles.transactionDate}>
                      💵 Ortalama: {formatCurrency(asset.ortalamaAlis)}
                    </Text>
                  </View>
                </View>
                <View style={styles.stockRight}>
                  <Text style={styles.transactionAmount}>
                    {formatCurrency(asset.alisToplam - asset.satisToplam)}
                  </Text>
                  <Text style={[styles.stockGainLoss, { color: getGainLossColor(asset.karZarar) }]}>
                    {asset.karZarar >= 0 ? '+' : ''}{formatCurrency(asset.karZarar)}
                  </Text>
                  <View style={styles.performanceIndicator}>
                    <Icon 
                      name={getPerformanceIcon(asset.karZarar)} 
                      size={14} 
                      color={getGainLossColor(asset.karZarar)}
                      style={styles.performanceIcon}
                    />
                    <Text style={[styles.performanceText, { color: getGainLossColor(asset.karZarar) }]}>
                      {asset.karZarar >= 0 ? 'KAZANÇ' : 'KAYIP'}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default PortfolioScreen;