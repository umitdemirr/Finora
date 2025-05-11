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
import { LineChart, BarChart } from 'react-native-chart-kit';

const AnalysisScreen = ({ route }) => {
  // Default asset data if route.params is undefined
  const defaultAsset = {
    name: 'Genel Analiz',
    symbol: 'GENEL',
    currentPrice: 0,
    change: 0,
  };

  const asset = route?.params?.asset || defaultAsset;
  const [timeRange, setTimeRange] = useState('1Y');
  const [chartType, setChartType] = useState('line');

  const timeRanges = [
    { id: '1A', label: '1 Ay' },
    { id: '3A', label: '3 Ay' },
    { id: '6A', label: '6 Ay' },
    { id: '1Y', label: '1 Yıl' },
    { id: '5Y', label: '5 Yıl' },
  ];

  // Örnek performans verileri
  const performanceData = {
    returns: {
      daily: 2.35,
      weekly: 5.75,
      monthly: 12.45,
      yearly: 45.80,
    },
    volatility: 18.5,
    sharpeRatio: 1.8,
    maxDrawdown: -15.2,
    beta: 1.15,
    correlation: 0.85,
  };

  // Örnek grafik verisi
  const lineChartData = {
    labels: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
    datasets: [{
      data: [
        100, 105, 102, 110, 108, 115, 112, 120, 118, 125, 122, 130
      ],
    }],
  };

  const barChartData = {
    labels: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz'],
    datasets: [{
      data: [20, -5, 15, -8, 12, 8],
    }],
  };

  const renderChart = () => {
    const chartConfig = {
      backgroundColor: '#FFF',
      backgroundGradientFrom: '#FFF',
      backgroundGradientTo: '#FFF',
      decimalPlaces: 1,
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
    };

    const chartStyle = {
      marginVertical: 8,
      borderRadius: 16,
    };

    if (chartType === 'line') {
      return (
        <LineChart
          data={lineChartData}
          width={Dimensions.get('window').width - 32}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={chartStyle}
        />
      );
    } else {
      return (
        <BarChart
          data={barChartData}
          width={Dimensions.get('window').width - 32}
          height={220}
          chartConfig={chartConfig}
          style={chartStyle}
          showValuesOnTopOfBars
        />
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.assetInfo}>
          <Text style={styles.assetName}>{asset.name}</Text>
          <Text style={styles.assetSymbol}>{asset.symbol}</Text>
        </View>
        <View style={styles.priceInfo}>
          <Text style={styles.currentPrice}>
            ₺{asset.currentPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
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
        <View style={styles.chartControls}>
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

          <View style={styles.chartTypeButtons}>
            <TouchableOpacity
              style={[
                styles.chartTypeButton,
                chartType === 'line' && styles.chartTypeButtonActive
              ]}
              onPress={() => setChartType('line')}
            >
              <Icon
                name="chart-line"
                size={24}
                color={chartType === 'line' ? '#2196F3' : '#666'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.chartTypeButton,
                chartType === 'bar' && styles.chartTypeButtonActive
              ]}
              onPress={() => setChartType('bar')}
            >
              <Icon
                name="chart-bar"
                size={24}
                color={chartType === 'bar' ? '#2196F3' : '#666'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {renderChart()}
      </View>

      <View style={styles.performanceSection}>
        <Text style={styles.sectionTitle}>Performans Metrikleri</Text>
        
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Günlük Getiri</Text>
            <Text style={[
              styles.metricValue,
              { color: performanceData.returns.daily >= 0 ? '#4CAF50' : '#F44336' }
            ]}>
              {performanceData.returns.daily >= 0 ? '+' : ''}
              {performanceData.returns.daily.toFixed(2)}%
            </Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Haftalık Getiri</Text>
            <Text style={[
              styles.metricValue,
              { color: performanceData.returns.weekly >= 0 ? '#4CAF50' : '#F44336' }
            ]}>
              {performanceData.returns.weekly >= 0 ? '+' : ''}
              {performanceData.returns.weekly.toFixed(2)}%
            </Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Aylık Getiri</Text>
            <Text style={[
              styles.metricValue,
              { color: performanceData.returns.monthly >= 0 ? '#4CAF50' : '#F44336' }
            ]}>
              {performanceData.returns.monthly >= 0 ? '+' : ''}
              {performanceData.returns.monthly.toFixed(2)}%
            </Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Yıllık Getiri</Text>
            <Text style={[
              styles.metricValue,
              { color: performanceData.returns.yearly >= 0 ? '#4CAF50' : '#F44336' }
            ]}>
              {performanceData.returns.yearly >= 0 ? '+' : ''}
              {performanceData.returns.yearly.toFixed(2)}%
            </Text>
          </View>
        </View>

        <View style={styles.riskMetrics}>
          <View style={styles.riskMetricRow}>
            <Text style={styles.riskMetricLabel}>Volatilite</Text>
            <Text style={styles.riskMetricValue}>%{performanceData.volatility.toFixed(2)}</Text>
          </View>

          <View style={styles.riskMetricRow}>
            <Text style={styles.riskMetricLabel}>Sharpe Oranı</Text>
            <Text style={styles.riskMetricValue}>{performanceData.sharpeRatio.toFixed(2)}</Text>
          </View>

          <View style={styles.riskMetricRow}>
            <Text style={styles.riskMetricLabel}>Maksimum Düşüş</Text>
            <Text style={[
              styles.riskMetricValue,
              { color: '#F44336' }
            ]}>
              {performanceData.maxDrawdown.toFixed(2)}%
            </Text>
          </View>

          <View style={styles.riskMetricRow}>
            <Text style={styles.riskMetricLabel}>Beta</Text>
            <Text style={styles.riskMetricValue}>{performanceData.beta.toFixed(2)}</Text>
          </View>

          <View style={styles.riskMetricRow}>
            <Text style={styles.riskMetricLabel}>Korelasyon</Text>
            <Text style={styles.riskMetricValue}>{performanceData.correlation.toFixed(2)}</Text>
          </View>
        </View>
      </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  assetSymbol: {
    fontSize: 14,
    color: '#666',
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  priceChange: {
    fontSize: 14,
    fontWeight: '500',
  },
  chartSection: {
    backgroundColor: '#FFF',
    marginTop: 16,
    padding: 16,
    elevation: 2,
  },
  chartControls: {
    marginBottom: 16,
  },
  timeRangeContainer: {
    marginBottom: 16,
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
  chartTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  chartTypeButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  chartTypeButtonActive: {
    backgroundColor: '#E3F2FD',
  },
  performanceSection: {
    backgroundColor: '#FFF',
    marginTop: 16,
    padding: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 24,
  },
  metricCard: {
    width: '50%',
    padding: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  riskMetrics: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 16,
  },
  riskMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  riskMetricLabel: {
    fontSize: 14,
    color: '#666',
  },
  riskMetricValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});

export default AnalysisScreen;