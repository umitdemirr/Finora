import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { Dimensions } from 'react-native';
import { LineChart, PieChart, BarChart, ProgressChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import { HomeStyles as styles, colors } from '../../styles/homeScreenStyles';

const screenWidth = Dimensions.get('window').width;

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('5G'); // 5 gün varsayılan
  const [selectedChartView, setSelectedChartView] = useState('line'); // çizgi grafik varsayılan
  const [transactions, setTransactions] = useState([]); // Tüm işlemleri saklamak için
  const [dashboard, setDashboard] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    accounts: [],
    incomeExpenseHistory: [],
    assetDistribution: [],
    recentTransactions: [],
    expenseCategories: [],
    budgetTracking: [],
  });

  const timeRanges = [
    { id: '5G', label: '5 Gün', days: 5 },
    { id: '1H', label: '1 Hafta', days: 7 },
    { id: '1A', label: '1 Ay', days: 30 },
    { id: '3A', label: '3 Ay', days: 90 },
  ];

  const chartViews = [
    { id: 'line', label: 'Çizgi', icon: 'chart-line' },
    { id: 'bar', label: 'Çubuk', icon: 'chart-bar' },
  ];

  const getDaysInRange = (days) => {
    const dates = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const categoryColors = {
    'Market Alışverişi': '#7DCEA0',
    'Ulaşım': '#74B9FF',
    'Eğlence': '#FFD55F',
    'Faturalar': '#48DBFB',
    'Sağlık': '#A8A7F3',
    'Diğer': '#FFB6B9',
  };

  // Sabit kategori sırası
  const categoryOrder = [
    'Market Alışverişi',
    'Ulaşım',
    'Eğlence',
    'Faturalar',
    'Sağlık',
    'Diğer'
  ];

  // Kategori eşleştirme fonksiyonu
  const getCategoryFromTransaction = (transaction) => {
    if (transaction.transactionType === 'Gelir') {
      return 'Gelir';
    }

    // API'den gelen type değerini kullan
    return transaction.type || 'Diğer';
  };

  const processTransactionData = useCallback((transactions, selectedRange) => {
    const range = timeRanges.find(r => r.id === selectedRange);
    const dates = getDaysInRange(range.days);
    const history = dates.map(date => ({
      date,
      income: 0,
      expense: 0
    }));

    // Seçilen tarih aralığındaki işlemleri filtrele
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - range.days);

    const filteredTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.transactionDate);
      return transactionDate >= startDate;
    });

    // Her işlemi ilgili güne ekle
    filteredTransactions.forEach(transaction => {
      const transDate = new Date(transaction.transactionDate).toISOString().split('T')[0];
      const historyItem = history.find(item => item.date === transDate);
      
      if (historyItem) {
        if (transaction.transactionType === 'Gelir') {
          historyItem.income += parseFloat(transaction.amount) || 0;
        } else {
          historyItem.expense += parseFloat(transaction.amount) || 0;
        }
      }
    });

    // Aylık gelir, gider ve net bakiye hesapla
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.transactionDate);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    const totalIncome = monthlyTransactions.reduce((sum, transaction) => 
      transaction.transactionType === 'Gelir' ? sum + (parseFloat(transaction.amount) || 0) : sum, 0);
    
    const totalExpense = monthlyTransactions.reduce((sum, transaction) => 
      transaction.transactionType === 'Gider' ? sum + (parseFloat(transaction.amount) || 0) : sum, 0);

    const netBalance = totalIncome - totalExpense;

    // Harcama kategorilerini hesapla
    const categories = {};
    const budgets = {
      'Market Alışverişi': { limit: 3000, current: 0 },
      'Ulaşım': { limit: 1000, current: 0 },
      'Eğlence': { limit: 1500, current: 0 },
      'Faturalar': { limit: 2000, current: 0 },
      'Sağlık': { limit: 1000, current: 0 },
      'Diğer': { limit: 1000, current: 0 },
    };

    filteredTransactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount) || 0;
      if (transaction.transactionType === 'Gider') {
        const category = getCategoryFromTransaction(transaction);
        categories[category] = (categories[category] || 0) + amount;
        
        // Bütçe takibi
        if (budgets[category]) {
          budgets[category].current += amount;
        }
      }
    });

    // Kategori verilerini pie chart formatına dönüştür
    const expenseCategories = Object.entries(categories)
      .map(([name, amount]) => ({
        name,
        amount,
        color: categoryColors[name] || '#FFB6B9',
      }))
      .filter(category => category.amount > 0)
      .sort((a, b) => b.amount - a.amount);

    // Bütçe takip verilerini hazırla
    const budgetTracking = Object.entries(budgets)
      .map(([category, data]) => ({
        category,
        current: data.current,
        limit: data.limit,
        percentage: Math.min((data.current / data.limit) * 100, 100),
      }))
      .sort((a, b) => {
        return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
      });

    return {
      history,
      totalIncome,
      totalExpense,
      netBalance,
      expenseCategories,
      budgetTracking,
    };
  }, []);

  // Zaman aralığı değiştiğinde verileri güncelle
  useEffect(() => {
    if (transactions.length > 0) {
      const { history, totalIncome, totalExpense, netBalance, expenseCategories, budgetTracking } = processTransactionData(transactions, selectedTimeRange);
      setDashboard(prev => ({
        ...prev,
        totalIncome,
        totalExpense,
        netBalance,
        incomeExpenseHistory: history,
        expenseCategories,
        budgetTracking,
      }));
    }
  }, [selectedTimeRange, transactions, processTransactionData]);

  const fetchDashboard = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('Kullanıcı kimliği bulunamadı');
      }

      // Hesaplar
      const accountsRes = await api.get(`/BankAccount/getdetailbyuserid?userId=${userId}`);
      const accounts = accountsRes.data.success ? accountsRes.data.data : [];

      // Tüm işlemleri al
      const transactionsRes = await api.get(`/BankTransaction/getdetail?userId=${userId}`);
      const allTransactions = transactionsRes.data.success ? transactionsRes.data.data : [];
      
      // Son 5 işlemi al (Debit işlemlerini hariç tut)
      const recentTransactions = [...allTransactions]
        .filter(t => t.transactionType !== 'Debit')
        .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
        .slice(0, 5);

      // Tüm işlemleri state'e kaydet
      setTransactions(allTransactions);

      // Seçili zaman aralığı için verileri işle
      const { history, totalIncome, totalExpense, netBalance, expenseCategories, budgetTracking } = processTransactionData(allTransactions, selectedTimeRange);

      // Her hesap için bakiyeyi hesapla
      const updatedAccounts = await Promise.all(accounts.map(async (account) => {
        // Hesaba ait işlemleri filtrele
        const accountTransactions = allTransactions.filter(
          transaction => transaction.accountId === account.accountId
        );

        // Yeni bakiyeyi hesapla (sadece görüntüleme için)
        const calculatedBalance = accountTransactions.reduce((balance, transaction) => {
          if (transaction.transactionType === 'Gelir') {
            return balance + parseFloat(transaction.amount);
          } else if (transaction.transactionType === 'Gider') {
            return balance - parseFloat(transaction.amount);
          } else {
            return balance; // Debit işlemleri hesap bakiyesini etkilemez
          }
        }, 0);

        // Bakiyeyi otomatik güncelleme - KALDIRILDI
        // Artık sadece transaction ekleme sırasında güncelleniyor
        
        return account; // Değişiklik yapmadan geri dön
      }));

      // Toplam varlığı hesapla (tüm hesapların bakiyelerinin toplamı)
      const totalAccountBalance = updatedAccounts.reduce((sum, account) => 
        sum + (parseFloat(account.balance) || 0), 0);

      // Varlık dağılımı
      const assetDistribution = [
        { name: 'Nakit', amount: totalAccountBalance, color: '#8ab6f9' },
        { name: 'Diğer', amount: 0, color: '#b39ddb' },
      ];

      setDashboard({
        totalBalance: totalAccountBalance,
        totalIncome,
        totalExpense,
        netBalance,
        accounts: updatedAccounts,
        incomeExpenseHistory: history,
        assetDistribution,
        recentTransactions,
        expenseCategories,
        budgetTracking,
      });
    } catch (error) {
      Alert.alert(
        'Hata',
        error.message || 'Dashboard verileri alınamadı. Lütfen tekrar deneyin.'
      );
      console.error('Dashboard Error:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedTimeRange, processTransactionData]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const formatCurrency = (amount) => {
    if (isNaN(amount)) return '₺0,00';
    return '₺' + Number(amount).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatTransactionDate = (dateString) => {
    try {
      if (!dateString) return '';
      
      // API'den gelen string'i Date objesine çevir
      const date = new Date(dateString);
      
      // Geçerli bir tarih mi kontrol et
      if (isNaN(date.getTime())) return '';
      
      // Türkçe tarih formatında göster
      return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Tarih formatlama hatası:', error);
      return '';
    }
  };

  const formatChartDate = (dateString) => {
    const date = new Date(dateString);
    const range = timeRanges.find(r => r.id === selectedTimeRange);
    
    switch (range.id) {
      case '5G':
        // 5 gün için: "15 Mar"
        return date.toLocaleDateString('tr-TR', {
          day: 'numeric',
          month: 'short'
        });
      case '1H':
        // 1 hafta için: "Pzt 15"
        return date.toLocaleDateString('tr-TR', {
          weekday: 'short',
          day: 'numeric'
        });
      case '1A':
        // 1 ay için: "15 Mar"
        return date.toLocaleDateString('tr-TR', {
          day: 'numeric',
          month: 'short'
        });
      case '3A':
        // 3 ay için: "Mar"
        return date.toLocaleDateString('tr-TR', {
          month: 'short'
        });
      default:
        return date.toLocaleDateString('tr-TR', {
          day: 'numeric',
          month: 'short'
        });
    }
  };

  // Grafik verilerini hazırla
  const prepareChartData = useCallback(() => {
    const labels = dashboard.incomeExpenseHistory.map(d => formatChartDate(d.date));
    
    // Zaman aralığına göre veri noktası sayısını ayarla
    const range = timeRanges.find(r => r.id === selectedTimeRange);
    const skipPoints = range.days > 30 ? Math.floor(range.days / 15) : 1; // 30 günden fazlaysa veri noktalarını azalt
    
    const filteredLabels = labels.filter((_, index) => index % skipPoints === 0);
    const filteredData = dashboard.incomeExpenseHistory.filter((_, index) => index % skipPoints === 0);

    return {
      labels: filteredLabels,
      datasets: [
        {
          data: filteredData.map(d => d.income),
          color: () => '#4CAF50',
          strokeWidth: 2,
        },
        {
          data: filteredData.map(d => d.expense),
          color: () => '#FF5252',
          strokeWidth: 2,
        },
      ],
      legend: ['Gelir', 'Gider'],
    };
  }, [dashboard.incomeExpenseHistory, selectedTimeRange]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    labelColor: () => '#888',
    propsForDots: { r: '3', strokeWidth: '2', stroke: '#fff' },
    propsForLabels: {
      fontSize: 12,
    },
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Premium Cards */}
        <View style={styles.cardsContainer}>
          <LinearGradient
            colors={colors.premium.mainCardGradient}
            style={[styles.premiumCard, styles.mainCard]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.mainCardLabel}>Toplam Varlık</Text>
                <Icon name="wallet" size={28} color="rgba(255,255,255,0.9)" />
              </View>
              <Text style={styles.mainCardValue}>{formatCurrency(dashboard.totalBalance)}</Text>
              <Text style={styles.mainCardSubtext}>Tüm hesaplarınızın toplamı</Text>
            </View>
          </LinearGradient>

          <View style={styles.smallCardsRow}>
            <LinearGradient
              colors={colors.premium.incomeCardGradient}
              style={[styles.premiumCard, styles.smallCard]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
            >
              <View style={styles.smallCardContent}>
                <Icon name="trending-up" size={24} color="rgba(255,255,255,0.9)" />
                <Text style={styles.smallCardValue}>{formatCurrency(dashboard.totalIncome)}</Text>
                <Text style={styles.smallCardLabel}>Aylık Gelir</Text>
              </View>
            </LinearGradient>

            <LinearGradient
              colors={colors.premium.expenseCardGradient}
              style={[styles.premiumCard, styles.smallCard]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
            >
              <View style={styles.smallCardContent}>
                <Icon name="trending-down" size={24} color="rgba(255,255,255,0.9)" />
                <Text style={styles.smallCardValue}>{formatCurrency(dashboard.totalExpense)}</Text>
                <Text style={styles.smallCardLabel}>Aylık Gider</Text>
              </View>
            </LinearGradient>
          </View>

          <LinearGradient
            colors={dashboard.netBalance >= 0 ? colors.premium.positiveNetGradient : colors.premium.negativeNetGradient}
            style={[styles.premiumCard, styles.netCard]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.netCardLabel}>Aylık Net Bakiye</Text>
                <Icon 
                  name={dashboard.netBalance >= 0 ? "trending-up" : "trending-down"} 
                  size={24} 
                  color="rgba(255,255,255,0.9)" 
                />
              </View>
              <Text style={styles.netCardValue}>{formatCurrency(dashboard.netBalance)}</Text>
              <Text style={styles.netCardSubtext}>
                {dashboard.netBalance >= 0 ? "Harika! Pozitif bakiye" : "Dikkat! Negatif bakiye"}
              </Text>
            </View>
          </LinearGradient>

          {/* AI Budget Analysis Button */}
          <TouchableOpacity 
            style={styles.analysisButton}
            onPress={() => navigation.navigate('BudgetAnalysis')}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.analysisButtonGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
            >
              <View style={styles.analysisButtonContent}>
                <View style={styles.analysisButtonLeft}>
                  <Icon name="brain" size={28} color="#fff" />
                  <View style={styles.analysisButtonText}>
                    <Text style={styles.analysisButtonTitle}>AI Bütçe Analizi</Text>
                    <Text style={styles.analysisButtonSubtitle}>Harcamalarınızı analiz edin</Text>
                  </View>
                </View>
                <Icon name="chevron-right" size={24} color="rgba(255,255,255,0.8)" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Premium Chart Section */}
        <View style={styles.chartSection}>
          <View style={styles.premiumGraphCard}>
            <View style={styles.graphHeader}>
              <Text style={styles.graphTitle}>Gelir/Gider Analizi</Text>
              <Text style={styles.graphSubtitle}>Finansal performansınızı takip edin</Text>
              
              <View style={styles.filterContainer}>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.filtersScroll}
                >
                  {timeRanges.map((range) => (
                    <TouchableOpacity
                      key={range.id}
                      style={[
                        styles.premiumFilterButton,
                        selectedTimeRange === range.id && styles.premiumFilterButtonActive
                      ]}
                      onPress={() => setSelectedTimeRange(range.id)}
                    >
                      <Text style={[
                        styles.premiumFilterButtonText,
                        selectedTimeRange === range.id && styles.premiumFilterButtonTextActive
                      ]}>
                        {range.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                
                <View style={styles.chartViewOptions}>
                  {chartViews.map((view) => (
                    <TouchableOpacity
                      key={view.id}
                      style={[
                        styles.premiumViewButton,
                        selectedChartView === view.id && styles.premiumViewButtonActive
                      ]}
                      onPress={() => setSelectedChartView(view.id)}
                    >
                      <Icon 
                        name={view.icon} 
                        size={20} 
                        color={selectedChartView === view.id ? '#fff' : '#718096'} 
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
            
            <View style={styles.chartContainer}>
              {selectedChartView === 'line' ? (
                <LineChart
                  data={prepareChartData()}
                  width={screenWidth * 0.85}
                  height={200}
                  chartConfig={{
                    ...chartConfig,
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: colors.premium.chartBackground,
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(74, 85, 104, ${opacity})`,
                    labelColor: () => '#718096',
                    propsForDots: { r: '4', strokeWidth: '2', stroke: '#4a5568' },
                    propsForLabels: { fontSize: 11 },
                  }}
                  bezier
                  style={styles.chart}
                />
              ) : (
                <BarChart
                  data={prepareChartData()}
                  width={screenWidth * 0.85}
                  height={200}
                  chartConfig={{
                    ...chartConfig,
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: colors.premium.chartBackground,
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(74, 85, 104, ${opacity})`,
                    labelColor: () => '#718096',
                    propsForLabels: { fontSize: 11 },
                  }}
                  style={styles.chart}
                  showValuesOnTopOfBars
                />
              )}
            </View>
          </View>

          {/* Asset Distribution Chart */}
          <View style={styles.premiumGraphCard}>
            <Text style={styles.graphTitle}>Varlık Dağılımı</Text>
            <Text style={styles.graphSubtitle}>Portföyünüzün genel görünümü</Text>
            <View style={styles.chartContainer}>
              <PieChart
                data={dashboard.assetDistribution.map((a) => ({
                  name: a.name,
                  population: a.amount,
                  color: a.color,
                  legendFontColor: '#333',
                  legendFontSize: 13,
                }))}
                width={screenWidth * 0.85}
                height={180}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="0"
                hasLegend={true}
                center={[0, 0]}
                absolute
              />
            </View>
          </View>

          {/* Expense Categories Chart */}
          <View style={styles.premiumGraphCard}>
            <Text style={styles.graphTitle}>Harcama Kategorileri</Text>
            <Text style={styles.graphSubtitle}>Nereye ne kadar harcıyorsunuz?</Text>
            <View style={styles.chartContainer}>
              <PieChart
                data={dashboard.expenseCategories.map(cat => ({
                  name: cat.name,
                  population: cat.amount,
                  color: cat.color,
                  legendFontColor: '#333',
                  legendFontSize: 12,
                }))}
                width={screenWidth * 0.85}
                height={200}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>
          </View>
        </View>

        {/* Premium Transactions Section */}
        <View style={styles.premiumTransactionsContainer}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Son İşlemler</Text>
              <Text style={styles.sectionSubtitle}>En son finansal hareketleriniz</Text>
            </View>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Transactions')}
              style={styles.premiumViewAllButton}
            >
              <Text style={styles.viewAllText}>Tümünü Gör</Text>
              <Icon name="chevron-right" size={20} color={colors.premium.filterActive} />
            </TouchableOpacity>
          </View>
          
          {dashboard.recentTransactions.length > 0 ? (
            dashboard.recentTransactions.map((transaction, index) => (
              <View key={transaction.id || index} style={styles.premiumTransactionItem}>
                <View style={styles.transactionIconContainer}>
                  <LinearGradient
                    colors={transaction.transactionType === 'Gelir' ? colors.premium.incomeIconGradient : colors.premium.expenseIconGradient}
                    style={styles.transactionIconGradient}
                  >
                    <Icon 
                      name={transaction.transactionType === 'Gelir' ? 'arrow-down' : 'arrow-up'} 
                      size={20} 
                      color="#fff" 
                    />
                  </LinearGradient>
                </View>
                
                <View style={styles.transactionInfo}>
                  <Text style={styles.premiumTransactionDescription}>
                    {transaction.description || transaction.category || 'İşlem'}
                  </Text>
                  <Text style={styles.premiumTransactionDate}>
                    {formatTransactionDate(transaction.transactionDate)}
                  </Text>
                </View>
                
                <Text 
                  style={[
                    styles.premiumTransactionAmount,
                    { color: transaction.transactionType === 'Gelir' ? '#2f855a' : '#e53e3e' }
                  ]}
                >
                  {transaction.transactionType === 'Gelir' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.noTransactionsContainer}>
              <Icon name="receipt" size={48} color="#a0aec0" />
              <Text style={styles.noTransactionsText}>Henüz işlem bulunmuyor</Text>
              <Text style={styles.noTransactionsSubtext}>İlk işleminizi ekleyerek başlayın</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;