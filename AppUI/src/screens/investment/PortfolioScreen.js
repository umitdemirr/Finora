import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PortfolioScreen = ({ navigation }) => {
  const [showBalance, setShowBalance] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const portfolioData = {
    totalValue: 157500.25,
    totalProfit: 12350.75,
    profitPercentage: 8.52,
    assets: [
      {
        id: 1,
        symbol: 'THYAO',
        name: 'Türk Hava Yolları',
        quantity: 100,
        averagePrice: 170.25,
        currentPrice: 185.50,
        type: 'stock',
        change: 2.35,
      },
      {
        id: 2,
        symbol: 'BTC',
        name: 'Bitcoin',
        quantity: 0.25,
        averagePrice: 52000.00,
        currentPrice: 55000.00,
        type: 'crypto',
        change: 5.75,
      },
      {
        id: 3,
        symbol: 'EUR/TRY',
        name: 'Euro/TL',
        quantity: 1000,
        averagePrice: 32.75,
        currentPrice: 33.25,
        type: 'forex',
        change: 1.52,
      },
      {
        id: 4,
        symbol: 'XAU',
        name: 'Altın',
        quantity: 50,
        averagePrice: 1200.00,
        currentPrice: 1250.00,
        type: 'gold',
        change: 4.17,
      },
    ],
  };

  const categories = [
    { id: 'all', name: 'Tümü', icon: 'view-grid' },
    { id: 'stock', name: 'Hisse', icon: 'chart-line-variant' },
    { id: 'crypto', name: 'Kripto', icon: 'bitcoin' },
    { id: 'forex', name: 'Döviz', icon: 'currency-usd' },
    { id: 'gold', name: 'Altın', icon: 'gold' },
  ];

  const filteredAssets = selectedCategory === 'all'
    ? portfolioData.assets
    : portfolioData.assets.filter(asset => asset.type === selectedCategory);

  const renderAssetItem = ({ item }) => {
    const totalValue = item.quantity * item.currentPrice;
    const profit = (item.currentPrice - item.averagePrice) * item.quantity;
    const profitPercentage = ((item.currentPrice - item.averagePrice) / item.averagePrice) * 100;

    return (
      <TouchableOpacity
        style={styles.assetCard}
        onPress={() => navigation.navigate('AssetDetail', { asset: item })}
      >
        <View style={styles.assetHeader}>
          <View style={styles.assetInfo}>
            <Text style={styles.assetSymbol}>{item.symbol}</Text>
            <Text style={styles.assetName}>{item.name}</Text>
          </View>
          <View style={styles.priceInfo}>
            <Text style={styles.currentPrice}>
              {showBalance ? `₺${item.currentPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` : '••••••'}
            </Text>
            <Text style={[
              styles.changePercentage,
              { color: item.change >= 0 ? '#4CAF50' : '#F44336' }
            ]}>
              {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
            </Text>
          </View>
        </View>

        <View style={styles.assetDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Adet</Text>
            <Text style={styles.detailValue}>
              {showBalance ? item.quantity.toLocaleString('tr-TR') : '••••••'}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Toplam Değer</Text>
            <Text style={styles.detailValue}>
              {showBalance ? `₺${totalValue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` : '••••••'}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Kar/Zarar</Text>
            <Text style={[
              styles.detailValue,
              { color: profit >= 0 ? '#4CAF50' : '#F44336' }
            ]}>
              {showBalance ? (
                `${profit >= 0 ? '+' : ''}₺${profit.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                (${profitPercentage >= 0 ? '+' : ''}${profitPercentage.toFixed(2)}%)`
              ) : '••••••'}
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.buyButton]}
            onPress={() => navigation.navigate('Trade', { type: 'buy', asset: item })}
          >
            <Icon name="plus" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>Al</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.sellButton]}
            onPress={() => navigation.navigate('Trade', { type: 'sell', asset: item })}
          >
            <Icon name="minus" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>Sat</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Portföyüm</Text>
          <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
            <Icon 
              name={showBalance ? 'eye-outline' : 'eye-off-outline'} 
              size={24} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.totalValue}>
          <Text style={styles.totalValueLabel}>Toplam Değer</Text>
          <Text style={styles.totalValueAmount}>
            {showBalance 
              ? `₺${portfolioData.totalValue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` 
              : '••••••'
            }
          </Text>
          <Text style={[
            styles.totalProfit,
            { color: portfolioData.totalProfit >= 0 ? '#4CAF50' : '#F44336' }
          ]}>
            {showBalance ? (
              `${portfolioData.totalProfit >= 0 ? '+' : ''}₺${portfolioData.totalProfit.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              (${portfolioData.profitPercentage >= 0 ? '+' : ''}${portfolioData.profitPercentage.toFixed(2)}%)`
            ) : '••••••'}
          </Text>
        </View>
      </View>

      <View style={styles.categories}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Icon
                name={category.icon}
                size={20}
                color={selectedCategory === category.id ? '#2196F3' : '#666'}
              />
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredAssets}
        renderItem={renderAssetItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity
        style={styles.analysisButton}
        onPress={() => navigation.navigate('Analysis', {
          asset: {
            name: 'Portföy Genel',
            symbol: 'PORTFOLIO',
            currentPrice: portfolioData.totalValue,
            change: portfolioData.profitPercentage
          }
        })}
      >
        <Icon name="chart-box" size={24} color="#FFF" />
        <Text style={styles.analysisButtonText}>Performans Analizi</Text>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    marginBottom: 8,
  },
  totalValueLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  totalValueAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  totalProfit: {
    fontSize: 14,
    fontWeight: '500',
  },
  categories: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    marginBottom: 8,
    elevation: 2,
  },
  categoriesContainer: {
    paddingHorizontal: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: '#F5F5F5',
  },
  categoryButtonActive: {
    backgroundColor: '#E3F2FD',
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  categoryTextActive: {
    color: '#2196F3',
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
  assetCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  assetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  assetInfo: {
    flex: 1,
  },
  assetSymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  assetName: {
    fontSize: 14,
    color: '#666',
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  changePercentage: {
    fontSize: 14,
    fontWeight: '500',
  },
  assetDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  buyButton: {
    backgroundColor: '#4CAF50',
  },
  sellButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  analysisButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    elevation: 4,
  },
  analysisButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default PortfolioScreen;