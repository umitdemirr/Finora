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

const PortfolioAiAnalysisScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [assets, setAssets] = useState([]);
  const [analysis, setAnalysis] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/Asset/getall');
      
      if (response.data && response.data.data) {
        const assetsData = response.data.data.filter(asset => asset.kalanAdet > 0);
        setAssets(assetsData);
      } else {
        setAssets([]);
      }
    } catch (error) {
      console.error('Varlık bilgileri alınamadı:', error);
      Alert.alert('Hata', 'Portföy bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const analyzePortfolio = async () => {
    if (assets.length === 0) {
      Alert.alert('Uyarı', 'Analiz için portföyünüzde en az bir hisse senedi bulunmalıdır.');
      return;
    }

    try {
      setAnalyzing(true);
      
      // Portföy verilerini AI analizi için hazırla
      const portfolioData = assets.map(asset => ({
        sembol: asset.sembol,
        ad: asset.ad,
        assetType: asset.assetType || 'Hisse Senedi',
        alinanAdet: asset.alinanAdet,
        alisToplam: asset.alisToplam,
        satilanAdet: asset.satilanAdet,
        satisToplam: asset.satisToplam,
        kalanAdet: asset.kalanAdet,
        ortalamaAlis: asset.ortalamaAlis,
        karZarar: asset.karZarar,
        karZararYuzdesi: asset.karZararYuzdesi
      }));

      const requestData = {
        model: "gemini-2.0-flash",
        url: "https://26v20qzz-44324.euw.devtunnels.ms/api/Ai/simple-prompt",
        promptFor: "Invest",
        apiKey: "AIzaSyBTRhZOPny-JCtWt9I0jVNBvSHfEBLsKIg",
        entity: portfolioData,
        answer: "string"
      };

      const response = await fetch('https://26v20qzz-44324.euw.devtunnels.ms/api/Ai/invest-analysis', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        // Önce JSON olarak parse etmeyi dene
        let result;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          result = await response.json();
          
          // Eğer JSON response'da answer field'ı varsa direkt kullan
          if (result.answer) {
            setAnalysis(result.answer);
            return;
          } else if (typeof result === 'string') {
            result = result;
          } else {
            result = JSON.stringify(result);
          }
        } else {
          result = await response.text();
        }
        
        // API'den dönen cevabı parse et ve temizle
        let cleanedResult = result;
        
        try {
          // Eğer cevap JSON formatında ise parse et
          const jsonResponse = JSON.parse(result);
          if (jsonResponse.answer) {
            cleanedResult = jsonResponse.answer;
          }
        } catch (parseError) {
          // JSON parse edilemezse, farklı formatları dene
          
                     // 1. JSON objesi içinde answer field'ı ara (çok satırlı içerik için)
           const jsonMatch = result.match(/"answer"\s*:\s*"((?:[^"\\]|\\.)*)"/s);
           if (jsonMatch && jsonMatch[1]) {
             cleanedResult = jsonMatch[1];
          } else {
            // 2. Başında ve sonunda gereksiz karakterler varsa temizle
            cleanedResult = result
              .replace(/^[^a-zA-ZğüşıöçĞÜŞİÖÇ0-9#*\-+•]+/, '') // Başındaki gereksiz karakterleri temizle
              .replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ0-9.!?%\s\-+•)]*$/, '') // Sonundaki gereksiz karakterleri temizle
              .replace(/\\n/g, '\n') // Escape edilmiş newline'ları düzelt
              .replace(/\\"/g, '"') // Escape edilmiş tırnak işaretlerini düzelt
              .replace(/\\"([^"]*)\\":/g, '"$1":') // JSON formatındaki escape'leri düzelt
              .trim();
            
            // 3. Eğer hala JSON benzeri bir yapı varsa, sadece içeriği al
            const contentMatch = cleanedResult.match(/"answer"\s*:\s*"([^"]+)"/);
            if (contentMatch && contentMatch[1]) {
              cleanedResult = contentMatch[1];
            }
          }
        }
        
                 // Son temizlik: escape karakterleri ve gereksiz syntax'ı kaldır
         cleanedResult = cleanedResult
           .replace(/\\n/g, '\n') // Escape edilmiş newline'ları düzelt
           .replace(/\\"/g, '"') // Escape edilmiş tırnak işaretlerini düzelt
           .replace(/\\t/g, '\t') // Escape edilmiş tab'ları düzelt
           .replace(/\\r/g, '\r') // Escape edilmiş carriage return'leri düzelt
           .replace(/\\\\/g, '\\') // Escape edilmiş backslash'leri düzelt
           .trim();
         
         // Eğer hala JSON formatında başlıyorsa, sadece answer kısmını al
         if (cleanedResult.includes('"answer"')) {
           const answerMatch = cleanedResult.match(/"answer"\s*:\s*"((?:[^"\\]|\\.)*)"(?:,|\}|$)/s);
           if (answerMatch && answerMatch[1]) {
             cleanedResult = answerMatch[1]
               .replace(/\\n/g, '\n')
               .replace(/\\"/g, '"')
               .replace(/\\t/g, '\t')
               .replace(/\\r/g, '\r')
               .replace(/\\\\/g, '\\');
           }
         }
        
         setAnalysis(cleanedResult);
      } else {
        throw new Error('AI analizi başarısız oldu');
      }
    } catch (error) {
      console.error('AI analizi hatası:', error);
      Alert.alert('Hata', 'AI analizi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setAnalyzing(false);
    }
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

  const renderAnalysisText = (text) => {
    if (!text) return null;

    // Metni satırlara böl
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      const trimmedLine = line.trim();
      
      // Boş satır kontrolü
      if (trimmedLine === '') {
        return <View key={index} style={styles.analysisSpacing} />;
      }
      
      // Ana başlık kontrolü (## ile başlayan satırlar)
      if (trimmedLine.startsWith('##') && !trimmedLine.startsWith('###')) {
        return (
          <View key={index} style={styles.analysisTitleContainer}>
            <Icon name="chart-line" size={24} color="#8B5CF6" style={styles.analysisTitleIcon} />
            <Text style={styles.analysisTitle}>
              {trimmedLine.replace('##', '').trim()}
            </Text>
          </View>
        );
      }
      
      // Alt başlık kontrolü (### ile başlayan satırlar)
      if (trimmedLine.startsWith('###')) {
        return (
          <View key={index} style={styles.analysisSubtitleContainer}>
            <Icon name="chevron-right" size={20} color="#6366F1" style={styles.analysisSubtitleIcon} />
            <Text style={styles.analysisSubtitle}>
              {trimmedLine.replace('###', '').trim()}
            </Text>
          </View>
        );
      }
      
      // Numaralı ana başlık kontrolü (1. 2. 3. ile başlayan satırlar)
      if (/^\d+\./.test(trimmedLine)) {
        const match = trimmedLine.match(/^(\d+)\.\s*(.+)/);
        if (match) {
          return (
            <View key={index} style={styles.analysisTitleContainer}>
              <Icon name="star" size={24} color="#FFFFFF" style={styles.analysisTitleIcon} />
              <View style={styles.analysisNumberBadge}>
                <Text style={styles.analysisNumberText}>{match[1]}</Text>
              </View>
              <Text style={styles.analysisTitle}>
                {match[2]}
              </Text>
            </View>
          );
        }
      }
      
      // Liste öğesi kontrolü (- veya • ile başlayan satırlar)
      if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•') || trimmedLine.startsWith('*')) {
        return (
          <View key={index} style={styles.analysisListItem}>
            <View style={styles.analysisBulletContainer}>
              <Text style={styles.analysisBullet}>●</Text>
            </View>
            <Text style={styles.analysisListText}>
              {trimmedLine.replace(/^[-•*]\s*/, '').trim()}
            </Text>
          </View>
        );
      }
      
      // Alt başlık kontrolü (** ile çevrili metinler)
      if (trimmedLine.includes('**')) {
        // ** ile çevrili kısmı çıkar ve alt başlık olarak göster
        const boldMatch = trimmedLine.match(/\*\*(.*?)\*\*/);
        if (boldMatch && boldMatch[1]) {
          return (
            <View key={index} style={styles.analysisSubtitleContainer}>
              <Icon name="chevron-right" size={20} color="#FFFFFF" style={styles.analysisSubtitleIcon} />
              <Text style={styles.analysisSubtitle}>
                {boldMatch[1].trim()}
              </Text>
            </View>
          );
        } else {
          // Eğer ** formatı düzgün değilse, eski yöntemle göster
          const parts = trimmedLine.split('**');
          return (
            <View key={index} style={styles.analysisImportantContainer}>
              <Icon name="alert-circle" size={20} color="#F59E0B" style={styles.analysisImportantIcon} />
              <Text style={styles.analysisImportantText}>
                {parts.map((part, partIndex) => {
                  if (partIndex % 2 === 1) {
                    return (
                      <Text key={partIndex} style={styles.analysisBoldText}>
                        {part}
                      </Text>
                    );
                  }
                  return part;
                })}
              </Text>
            </View>
          );
        }
      }
      
      // Pozitif vurgular (+ ile başlayan satırlar)
      if (trimmedLine.startsWith('+')) {
        return (
          <View key={index} style={styles.analysisPositiveItem}>
            <Icon name="check-circle" size={18} color="#10B981" style={styles.analysisPositiveIcon} />
            <Text style={styles.analysisPositiveText}>
              {trimmedLine.replace(/^\+\s*/, '').trim()}
            </Text>
          </View>
        );
      }
      
      // Negatif vurgular (- ile başlayan ama liste olmayan satırlar)
      if (trimmedLine.startsWith('!') || (trimmedLine.startsWith('-') && trimmedLine.includes('risk'))) {
        return (
          <View key={index} style={styles.analysisNegativeItem}>
            <Icon name="alert-triangle" size={18} color="#EF4444" style={styles.analysisNegativeIcon} />
            <Text style={styles.analysisNegativeText}>
              {trimmedLine.replace(/^[!-]\s*/, '').trim()}
            </Text>
          </View>
        );
      }
      
      // Öneriler (Öneri: ile başlayan satırlar)
      if (trimmedLine.toLowerCase().startsWith('öneri:') || trimmedLine.toLowerCase().startsWith('tavsiye:')) {
        return (
          <View key={index} style={styles.analysisRecommendationContainer}>
            <Icon name="lightbulb" size={20} color="#8B5CF6" style={styles.analysisRecommendationIcon} />
            <Text style={styles.analysisRecommendationText}>
              {trimmedLine}
            </Text>
          </View>
        );
      }
      
      // Normal metin
      return (
        <Text key={index} style={styles.analysisText}>
          {trimmedLine}
        </Text>
      );
    });
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
        {/* Header */}
        <View style={styles.summaryContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <Text style={styles.summaryTitle}>🤖 AI Portföy Analizi</Text>
            <TouchableOpacity 
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 12,
                padding: 8,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.3)',
              }}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>📊 Analiz Edilen Hisse</Text>
              <Text style={styles.summaryValue}>{assets.length} Adet</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>💰 Toplam Portföy Değeri</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(assets.reduce((total, asset) => 
                  total + ((asset.kalanAdet * asset.ortalamaAlis) + asset.karZarar), 0))}
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>📈 Toplam Kar/Zarar</Text>
              <Text style={[styles.summaryValue, { 
                color: getGainLossColor(assets.reduce((total, asset) => total + asset.karZarar, 0)) 
              }]}>
                {assets.reduce((total, asset) => total + asset.karZarar, 0) >= 0 ? '+' : ''}
                {formatCurrency(assets.reduce((total, asset) => total + asset.karZarar, 0))}
              </Text>
            </View>
          </View>
        </View>

        {/* Portföy Özeti */}
        <View style={styles.portfolioContainer}>
          <Text style={styles.sectionTitle}>
            📋 Portföy Özeti
          </Text>
          
          {assets.map((asset, index) => (
            <View key={`${asset.sembol}-${index}`} style={styles.stockItem}>
              <View style={styles.stockLeft}>
                <View style={styles.stockIcon}>
                  <Icon 
                    name="chart-line" 
                    size={24} 
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
                <Text style={styles.stockValue}>
                  {formatCurrency((asset.kalanAdet * asset.ortalamaAlis) + asset.karZarar)}
                </Text>
                <Text style={[styles.stockGainLoss, { color: getGainLossColor(asset.karZarar) }]}>
                  {asset.karZarar >= 0 ? '+' : ''}{formatCurrency(asset.karZarar)}
                </Text>
                <Text style={[styles.stockPercentage, { color: getGainLossColor(asset.karZarar) }]}>
                  ({asset.karZarar >= 0 ? '+' : ''}{formatPercentage(asset.karZararYuzdesi)})
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* AI Analiz Butonu */}
        <View style={styles.portfolioContainer}>
          <TouchableOpacity 
            style={[styles.analyzeButton, analyzing && styles.analyzeButtonDisabled]}
            onPress={analyzePortfolio}
            disabled={analyzing || assets.length === 0}
          >
            {analyzing ? (
              <View style={styles.analyzeButtonContent}>
                <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.analyzeButtonText}>Analiz Ediliyor...</Text>
              </View>
            ) : (
              <View style={styles.analyzeButtonContent}>
                <Icon name="brain" size={24} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.analyzeButtonText}>AI ile Portföyü Analiz Et</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* AI Analiz Sonucu */}
        {analysis && (
          <View style={styles.analysisContainer}>
            <View style={styles.analysisHeaderContainer}>
              <View style={styles.analysisHeaderLeft}>
                <Icon name="brain" size={28} color="#8B5CF6" />
                <View style={styles.analysisHeaderInfo}>
                  <Text style={styles.sectionTitle}>AI Analiz Raporu</Text>
                  <Text style={styles.analysisHeaderSubtitle}>
                    Gemini 2.0 Flash tarafından oluşturuldu
                  </Text>
                </View>
              </View>
              <View style={styles.analysisStatusBadge}>
                <Icon name="check-circle" size={16} color="#10B981" />
                <Text style={styles.analysisStatusText}>Tamamlandı</Text>
              </View>
            </View>
            
            <View style={styles.analysisCard}>
              <View style={styles.analysisCardHeader}>
                <Icon name="file-document-outline" size={24} color="#8B5CF6" />
                <Text style={styles.analysisCardTitle}>Detaylı Portföy Analizi</Text>
              </View>
              
              <View style={styles.analysisContent}>
                {renderAnalysisText(analysis)}
              </View>
              
              <View style={styles.analysisFooter}>
                <Icon name="information-outline" size={16} color="#64748B" />
                <Text style={styles.analysisFooterText}>
                  Bu analiz yapay zeka tarafından oluşturulmuştur. Yatırım kararlarınızı verirken profesyonel danışmanlık alınız.
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default PortfolioAiAnalysisScreen; 