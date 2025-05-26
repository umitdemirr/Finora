import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Animated,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { LinearGradient } from 'expo-linear-gradient';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { colors } from '../../styles/globalStyles';

const { width } = Dimensions.get('window');

const BudgetAnalysisScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    loadData();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await loadTransactions();
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
      Alert.alert('Hata', 'Veriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Hata', 'Kullanıcı bilgisi bulunamadı.');
        return;
      }

      // Mevcut API endpoint'ini kullan
      const response = await api.get(`/BankTransaction/getdetail?userId=${userId}`);
      if (response.data.success && response.data.data) {
        // Son 30 günün işlemlerini al
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentTransactions = response.data.data.filter(transaction => {
          const transactionDate = new Date(transaction.transactionDate);
          return transactionDate >= thirtyDaysAgo;
        });

        setTransactions(recentTransactions);
      }
    } catch (error) {
      console.error('İşlemler yüklenemedi:', error);
      throw error;
    }
  };

  const parseAnalysisResponse = (response) => {
    try {
      // Eğer response zaten parse edilmiş bir obje ise
      if (typeof response === 'object' && response.length > 0) {
        return response;
      }
      
      // Eğer response string ise parse etmeye çalış
      if (typeof response === 'string') {
        // JSON formatında mı kontrol et
        if (response.trim().startsWith('[')) {
          return JSON.parse(response);
        }
        
        // Gelişmiş metin parse işlemi
        const sections = [];
        let text = response.trim();
        
        // Ana başlıkları bul (1., 2., 3. gibi)
        const mainSections = text.split(/(?=\d+\.\s)/);
        
        mainSections.forEach(sectionText => {
          if (!sectionText.trim()) return;
          
          const lines = sectionText.split('\n').map(line => line.trim()).filter(line => line);
          if (lines.length === 0) return;
          
          let title = '';
          let items = [];
          
          // İlk satırdan başlığı çıkar
          const firstLine = lines[0];
          if (firstLine.match(/^\d+\./)) {
            title = firstLine.replace(/^\d+\.\s*/, '').trim();
            lines.shift(); // İlk satırı kaldır
          } else {
            title = 'Genel Değerlendirme';
          }
          
          // Kalan içeriği işle
          let currentItem = '';
          
          lines.forEach(line => {
            // Alt başlık kontrolü (- ile başlayan)
            if (line.startsWith('-')) {
              if (currentItem.trim()) {
                items.push(formatAnalysisItem(currentItem.trim()));
                currentItem = '';
              }
              items.push(formatAnalysisItem(line.replace(/^-\s*/, '').trim()));
            }
            // Madde işareti kontrolü (• ile başlayan)
            else if (line.startsWith('•')) {
              if (currentItem.trim()) {
                items.push(formatAnalysisItem(currentItem.trim()));
                currentItem = '';
              }
              items.push(formatAnalysisItem(line.replace(/^•\s*/, '').trim()));
            }
            // Alt başlık kontrolü (büyük harfle başlayan ve : ile biten)
            else if (line.match(/^[A-ZÇĞIİÖŞÜ][^:]*:$/)) {
              if (currentItem.trim()) {
                items.push(formatAnalysisItem(currentItem.trim()));
                currentItem = '';
              }
              items.push({
                type: 'subtitle',
                text: line.replace(/:$/, '').trim()
              });
            }
            // Normal metin
            else {
              if (currentItem) {
                currentItem += ' ' + line;
              } else {
                currentItem = line;
              }
            }
          });
          
          // Son item'ı ekle
          if (currentItem.trim()) {
            items.push(formatAnalysisItem(currentItem.trim()));
          }
          
          if (title && items.length > 0) {
            sections.push({
              title: title,
              icon: 'lightbulb',
              items: items
            });
          }
        });
        
        return sections.length > 0 ? sections : [{ 
          title: 'Analiz Sonucu', 
          icon: 'lightbulb', 
          items: [formatAnalysisItem(response)] 
        }];
      }
      
      return [{ title: 'Analiz Sonucu', icon: 'lightbulb', items: [formatAnalysisItem(response)] }];
    } catch (error) {
      console.error('Response parse hatası:', error);
      return [{ title: 'Analiz Sonucu', icon: 'lightbulb', items: [formatAnalysisItem(response)] }];
    }
  };

  const formatAnalysisItem = (text) => {
    if (typeof text === 'object') return text;
    
    let cleanText = text.trim();
    
    // Başında - veya • olan metinleri temizle
    cleanText = cleanText.replace(/^[-•]\s*/, '');
    
    // Alt başlık kontrolü (büyük harfle başlayan ve : ile biten)
    if (cleanText.match(/^[A-ZÇĞIİÖŞÜ][^:]*:$/)) {
      return {
        type: 'subtitle',
        text: cleanText.replace(/:$/, '').trim()
      };
    }
    
    // Anahtar-değer çifti kontrolü (: içeren ama : ile bitmeyen)
    if (cleanText.includes(':') && !cleanText.endsWith(':')) {
      const colonIndex = cleanText.indexOf(':');
      const key = cleanText.substring(0, colonIndex).trim();
      const value = cleanText.substring(colonIndex + 1).trim();
      
      // Anahtar kısa ve değer var ise
      if (key.length < 50 && value.length > 0) {
        return {
          type: 'keyvalue',
          key: key,
          value: value
        };
      }
    }
    
    // Çok uzun metinleri paragraf olarak işle
    if (cleanText.length > 150) {
      // Cümlelere böl
      const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim());
      if (sentences.length > 1) {
        return {
          type: 'paragraph',
          sentences: sentences.map(s => s.trim()).filter(s => s.length > 0)
        };
      }
    }
    
    // Liste öğesi kontrolü (virgülle ayrılmış öğeler)
    if (cleanText.includes(',') && cleanText.split(',').length > 2) {
      const items = cleanText.split(',').map(item => item.trim()).filter(item => item.length > 0);
      if (items.length > 2 && items.every(item => item.length < 100)) {
        return {
          type: 'list',
          items: items
        };
      }
    }
    
    // Sayısal veri kontrolü (TL, %, sayı içeren)
    if (cleanText.match(/\d+[.,]?\d*\s*(TL|₺|%|adet|işlem)/i)) {
      return {
        type: 'highlight',
        text: cleanText
      };
    }
    
    // Öneri/tavsiye kontrolü
    if (cleanText.match(/^(öneri|tavsiye|öner|dikkat|uyarı|not)/i) || 
        cleanText.includes('önerilir') || 
        cleanText.includes('tavsiye') ||
        cleanText.includes('yapabilirsiniz') ||
        cleanText.includes('düşünebilirsiniz')) {
      return {
        type: 'recommendation',
        text: cleanText
      };
    }
    
    return {
      type: 'text',
      text: cleanText
    };
  };

  const analyzeWithAI = async () => {
    if (transactions.length === 0) {
      Alert.alert('Uyarı', 'Analiz için yeterli işlem verisi bulunamadı.');
      return;
    }

    try {
      setAnalysisLoading(true);
      
      // İşlem verilerini analiz için özetle
      const stats = getTransactionStats();
      const categoryData = Object.entries(stats.categoryExpenses)
        .map(([category, amount]) => `${category}: ${formatCurrency(amount)}`)
        .join(', ');

      // AI için prompt hazırla
      const analysisPrompt = `
Finansal Durum Analizi:
- Son 30 günde toplam gelir: ${formatCurrency(stats.totalIncome)}
- Son 30 günde toplam gider: ${formatCurrency(stats.totalExpense)}
- Net bakiye: ${formatCurrency(stats.netBalance)}
- Toplam işlem sayısı: ${stats.transactionCount}
- Harcama kategorileri: ${categoryData}

Bu finansal verilere dayanarak:
1. Harcama alışkanlıklarımı analiz et
2. Tasarruf önerileri ver
3. Bütçe yönetimi için pratik tavsiyeler sun
4. Risk alanlarını belirt
5. Pozitif yönlerimi vurgula

Lütfen kısa, anlaşılır ve uygulanabilir öneriler ver.`;

      const { data } = await api.post('/Ai/simple-prompt', {
        model: 'gemini-2.0-flash',
        apiKey: 'AIzaSyBTRhZOPny-JCtWt9I0jVNBvSHfEBLsKIg',
        prompt: analysisPrompt,
        answer: ''
      });

      if (data?.answer) {
        setAnalysis(data.answer);
      } else {
        throw new Error('AI analiz sonucu alınamadı');
      }
    } catch (error) {
      console.error('AI Analiz Hatası:', error);
      Alert.alert(
        'Analiz Hatası',
        'Bütçe analizi yapılırken bir hata oluştu. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.'
      );
    } finally {
      setAnalysisLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(amount);
  };

  const getTransactionStats = () => {
    const totalIncome = transactions
      .filter(t => t.transactionType === 'Gelir')
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

    const totalExpense = transactions
      .filter(t => t.transactionType === 'Gider')
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

    const categoryExpenses = {};
    transactions
      .filter(t => t.transactionType === 'Gider')
      .forEach(t => {
        const category = t.category || t.type || 'Diğer';
        categoryExpenses[category] = (categoryExpenses[category] || 0) + (parseFloat(t.amount) || 0);
      });

    return {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      categoryExpenses,
      transactionCount: transactions.length,
    };
  };

  const getCategoryChartData = () => {
    const stats = getTransactionStats();
    const categoryColors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
      '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
    ];

    return Object.entries(stats.categoryExpenses)
      .map(([name, amount], index) => ({
        name: name.length > 10 ? name.substring(0, 10) + '...' : name,
        amount,
        color: categoryColors[index % categoryColors.length],
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      }))
      .filter(item => item.amount > 0)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6); // En fazla 6 kategori göster
  };

  const renderHeader = () => (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Bütçe Analizi</Text>
          <Text style={styles.headerSubtitle}>AI Destekli Finansal İnceleme</Text>
        </View>
        <View style={styles.headerIcon}>
          <Icon name="chart-pie" size={28} color="#fff" />
        </View>
      </View>
    </LinearGradient>
  );

  const renderStats = () => {
    const stats = getTransactionStats();
    
    return (
      <Animated.View 
        style={[
          styles.statsContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <Text style={styles.sectionTitle}>Son 30 Gün Özeti</Text>
        
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#4CAF50' }]}>
            <Icon name="trending-up" size={24} color="#fff" />
            <Text style={styles.statValue}>{formatCurrency(stats.totalIncome)}</Text>
            <Text style={styles.statLabel}>Toplam Gelir</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: '#f44336' }]}>
            <Icon name="trending-down" size={24} color="#fff" />
            <Text style={styles.statValue}>{formatCurrency(stats.totalExpense)}</Text>
            <Text style={styles.statLabel}>Toplam Gider</Text>
          </View>
          
          <View style={[styles.statCard, { 
            backgroundColor: stats.netBalance >= 0 ? '#2196F3' : '#FF9800' 
          }]}>
            <Icon name="wallet" size={24} color="#fff" />
            <Text style={styles.statValue}>{formatCurrency(stats.netBalance)}</Text>
            <Text style={styles.statLabel}>Net Bakiye</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: '#9C27B0' }]}>
            <Icon name="receipt" size={24} color="#fff" />
            <Text style={styles.statValue}>{stats.transactionCount}</Text>
            <Text style={styles.statLabel}>İşlem Sayısı</Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderCategoryChart = () => {
    const chartData = getCategoryChartData();
    
    if (chartData.length === 0) {
      return (
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Kategori Dağılımı</Text>
          <View style={styles.emptyChart}>
            <Icon name="chart-pie" size={48} color="#ccc" />
            <Text style={styles.emptyChartText}>Gider kategorisi bulunamadı</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Gider Kategorileri</Text>
        <PieChart
          data={chartData}
          width={width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
    );
  };

  const getIconForSection = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('harcama') || titleLower.includes('analiz')) return 'chart-line';
    if (titleLower.includes('tasarruf')) return 'piggy-bank';
    if (titleLower.includes('bütçe') || titleLower.includes('yönetim')) return 'calculator';
    if (titleLower.includes('risk')) return 'alert-circle';
    if (titleLower.includes('pozitif') || titleLower.includes('güçlü')) return 'thumb-up';
    if (titleLower.includes('genel') || titleLower.includes('değerlendirme')) return 'clipboard-text';
    return 'lightbulb';
  };

  const renderAnalysisItem = (item, itemIndex) => {
    if (typeof item === 'string') {
      return (
        <View key={itemIndex} style={styles.analysisItem}>
          <View style={styles.bulletPoint} />
          <Text style={styles.analysisItemText}>{item}</Text>
        </View>
      );
    }

    switch (item.type) {
      case 'subtitle':
        return (
          <View key={itemIndex} style={styles.analysisSubtitle}>
            <Icon name="chevron-right" size={16} color="#2196F3" />
            <Text style={styles.analysisSubtitleText}>{item.text}</Text>
          </View>
        );
      
      case 'keyvalue':
        return (
          <View key={itemIndex} style={styles.analysisKeyValue}>
            <View style={styles.bulletPoint} />
            <View style={styles.keyValueContainer}>
              <Text style={styles.keyText}>{item.key}:</Text>
              <Text style={styles.valueText}>{item.value}</Text>
            </View>
          </View>
        );
      
      case 'paragraph':
        return (
          <View key={itemIndex} style={styles.analysisParagraph}>
            <View style={styles.bulletPoint} />
            <View style={styles.paragraphContainer}>
              {item.sentences.map((sentence, sentenceIndex) => (
                <Text key={sentenceIndex} style={styles.sentenceText}>
                  • {sentence}
                </Text>
              ))}
            </View>
          </View>
        );
      
      case 'list':
        return (
          <View key={itemIndex} style={styles.analysisList}>
            <View style={styles.bulletPoint} />
            <View style={styles.listContainer}>
              {item.items.map((listItem, listIndex) => (
                <View key={listIndex} style={styles.listItem}>
                  <Icon name="circle-small" size={16} color="#2196F3" />
                  <Text style={styles.listItemText}>{listItem}</Text>
                </View>
              ))}
            </View>
          </View>
        );
      
      case 'highlight':
        return (
          <View key={itemIndex} style={styles.analysisHighlight}>
            <Icon name="trending-up" size={16} color="#4CAF50" />
            <Text style={styles.highlightText}>{item.text}</Text>
          </View>
        );
      
      case 'recommendation':
        return (
          <View key={itemIndex} style={styles.analysisRecommendation}>
            <Icon name="lightbulb-outline" size={16} color="#FF9800" />
            <Text style={styles.recommendationText}>{item.text}</Text>
          </View>
        );
      
      default:
        return (
          <View key={itemIndex} style={styles.analysisItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.analysisItemText}>{item.text || item}</Text>
          </View>
        );
    }
  };

  const renderAnalysisSection = (section, index) => (
    <View key={index} style={styles.analysisSection}>
      <View style={styles.analysisSectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Icon name={getIconForSection(section.title)} size={20} color="#2196F3" />
        </View>
        <Text style={styles.analysisSectionTitle}>{section.title}</Text>
      </View>
      
      <View style={styles.analysisSectionContent}>
        {section.items.map((item, itemIndex) => renderAnalysisItem(item, itemIndex))}
      </View>
    </View>
  );

  const renderAIAnalysis = () => {
    const parsedSections = analysis ? parseAnalysisResponse(analysis) : null;
    
    return (
      <View style={styles.analysisContainer}>
        <View style={styles.analysisHeader}>
          <Icon name="robot" size={24} color="#2196F3" />
          <Text style={styles.sectionTitle}>AI Bütçe Analizi</Text>
        </View>
        
        {!analysis ? (
          <View style={styles.analysisPrompt}>
            <Text style={styles.analysisPromptText}>
              Harcama alışkanlıklarınızı analiz etmek ve kişiselleştirilmiş öneriler almak için AI analizi başlatın.
            </Text>
            <TouchableOpacity 
              style={styles.analyzeButton}
              onPress={analyzeWithAI}
              disabled={analysisLoading}
            >
              {analysisLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Icon name="brain" size={20} color="#fff" />
              )}
              <Text style={styles.analyzeButtonText}>
                {analysisLoading ? 'Analiz Ediliyor...' : 'AI Analizi Başlat'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.analysisResult}>
            {parsedSections && parsedSections.length > 0 ? (
              <View>
                {parsedSections.map((section, index) => renderAnalysisSection(section, index))}
              </View>
            ) : (
              <Text style={styles.analysisText}>{analysis}</Text>
            )}
            
            <TouchableOpacity 
              style={styles.reanalyzeButton}
              onPress={analyzeWithAI}
              disabled={analysisLoading}
            >
              <Icon name="refresh" size={16} color="#2196F3" />
              <Text style={styles.reanalyzeButtonText}>Yeniden Analiz Et</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Veriler yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderStats()}
        {renderCategoryChart()}
        {renderAIAnalysis()}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  headerIcon: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 60) / 2,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyChart: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyChartText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  analysisContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  analysisPrompt: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  analysisPromptText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  analysisResult: {
    paddingVertical: 10,
  },
  analysisText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    marginBottom: 16,
  },
  reanalyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
  },
  reanalyzeButtonText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  analysisSection: {
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  analysisSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  analysisSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  analysisSectionContent: {
    paddingLeft: 8,
  },
  analysisItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2196F3',
    marginTop: 6,
    marginRight: 12,
    marginLeft: 4,
  },
  analysisItemText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    flex: 1,
  },
  analysisSubtitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
    paddingLeft: 8,
  },
  analysisSubtitleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2196F3',
    marginLeft: 4,
    flex: 1,
  },
  analysisKeyValue: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  keyValueContainer: {
    flex: 1,
  },
  keyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  valueText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  analysisParagraph: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  paragraphContainer: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },
  sentenceText: {
    fontSize: 13,
    color: '#444',
    lineHeight: 18,
    marginBottom: 4,
  },
  analysisList: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  listItemText: {
    fontSize: 13,
    color: '#444',
    marginLeft: 4,
    flex: 1,
  },
  analysisHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  highlightText: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  analysisRecommendation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  recommendationText: {
    fontSize: 14,
    color: '#e65100',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  bottomSpacing: {
    height: 20,
  },
};

export default BudgetAnalysisScreen; 