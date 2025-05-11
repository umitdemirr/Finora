import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart } from 'react-native-chart-kit';

const AssetDetailScreen = ({ route, navigation }) => {
  const { asset } = route.params;
  const [timeRange, setTimeRange] = useState('1G');
  const [showBalance, setShowBalance] = useState(true);

  const timeRanges = [
    { id: '1G', label: '1 Gün' },
    { id: '1H', label: '1 Hafta' },
    { id: '1A', label: '1 Ay' },
    { id: '3A', label: '3 Ay' },
    { id: '1Y', label: '1 Yıl' },
    { id: 'TUM', label: 'Tümü' },
  ];

  // Örnek grafik verisi
  const chartData = {
    labels: ['09:30', '11:30', '13:30', '15:30', '17:30'],
    datasets: [{
      data: [
        asset.averagePrice * 0.98,
        asset.averagePrice * 1.02,
        asset.averagePrice * 0.99,
        asset.averagePrice * 1.03,
        asset.currentPrice,
      ],
    }],
  };

  const totalValue = asset.quantity * asset.currentPrice;
  const totalProfit = (asset.currentPrice - asset.averagePrice) * asset.quantity;
  const profitPercentage = ((asset.currentPrice - asset.averagePrice) / asset.averagePrice) * 100;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.assetInfo}>
            <Text style={styles.assetName}>{asset.name}</Text>
            <Text style={styles.assetSymbol}>{asset.symbol}</Text>
          </View>
          <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
            <Icon 
              name={showBalance ? 'eye-outline' : 'eye-off-outline'} 
              size={24} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.priceInfo}>
          <Text style={styles.currentPrice}>
            {showBalance ? `₺${asset.currentPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` : '••••••'}
          </Text>
          <Text style={[
            styles.priceChange,
            { color: asset.change >= 0 ? '#4CAF50' : '#F44336' }
          ]}>
            {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%
          </Text>
        </View>
      </View>

      <View style={styles.chartSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.timeRangeContainer}
        >
          {timeRanges.map(range => (
            <TouchableOpacity
              key={range.id}
              style={[
                styles.timeRangeButton,
                timeRange === range.id && styles.timeRangeButtonActive
              ]}
              onPress={() => setTimeRange(range.id)}
            >
              <Text style={[
                styles.timeRangeText,
                timeRange === range.id && styles.timeRangeTextActive
              ]}>
                {range.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 32}
          height={220}
          chartConfig={{
            backgroundColor: '#FFF',
            backgroundGradientFrom: '#FFF',
            backgroundGradientTo: '#FFF',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#2196F3',
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.detailsSection}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Miktar</Text>
            <Text style={styles.detailValue}>
              {showBalance ? asset.quantity.toLocaleString('tr-TR') : '••••••'}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Ortalama Maliyet</Text>
            <Text style={styles.detailValue}>
              {showBalance ? `₺${asset.averagePrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` : '••••••'}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Toplam Değer</Text>
            <Text style={styles.detailValue}>
              {showBalance ? `₺${totalValue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` : '••••••'}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Toplam Kar/Zarar</Text>
            <Text style={[
              styles.detailValue,
              { color: totalProfit >= 0 ? '#4CAF50' : '#F44336' }
            ]}>
              {showBalance ? (
                `${totalProfit >= 0 ? '+' : ''}₺${totalProfit.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                (${profitPercentage >= 0 ? '+' : ''}${profitPercentage.toFixed(2)}%)`
              ) : '••••••'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.buyButton]}
          onPress={() => navigation.navigate('Trade', { type: 'buy', asset })}
        >
          <Icon name="plus" size={20} color="#FFF" />
          <Text style={styles.actionButtonText}>Alış Emri Ver</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.sellButton]}
          onPress={() => navigation.navigate('Trade', { type: 'sell', asset })}
        >
          <Icon name="minus" size={20} color="#FFF" />
          <Text style={styles.actionButtonText}>Satış Emri Ver</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.analysisButton}
        onPress={() => navigation.navigate('Analysis', { asset })}
      >
        <Icon name="chart-box" size={24} color="#FFF" />
        <Text style={styles.analysisButtonText}>Detaylı Analiz</Text>
      </TouchableOpacity>
    </ScrollView>
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
  assetInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  assetSymbol: {
    fontSize: 16,
    color: '#666',
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  priceChange: {
    fontSize: 16,
    fontWeight: '500',
  },
  chartSection: {
    backgroundColor: '#FFF',
    marginTop: 16,
    padding: 16,
    elevation: 2,
  },
  timeRangeContainer: {
    paddingBottom: 16,
  },
  timeRangeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  timeRangeButtonActive: {
    backgroundColor: '#2196F3',
  },
  timeRangeText: {
    fontSize: 14,
    color: '#666',
  },
  timeRangeTextActive: {
    color: '#FFF',
    fontWeight: '500',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  detailsSection: {
    backgroundColor: '#FFF',
    marginTop: 16,
    padding: 16,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
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
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  analysisButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    margin: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  analysisButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default AssetDetailScreen; 