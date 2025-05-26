import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { AddStockTransactionStyles as styles } from '../../styles/globalStyles';

const AddStockTransactionScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [stockAccounts, setStockAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [transactionType, setTransactionType] = useState('BUY');
  const [assetType, setAssetType] = useState('STOCK'); // STOCK, CRYPTO, FOREX
  const [formData, setFormData] = useState({
    stockSymbol: '',
    name: '',
    price: '',
    quantity: '',
    assetType: 'STOCK',
    status: 'Filled',
  });

  // Popüler varlık listeleri
  const popularAssets = {
    STOCK: [
      { symbol: 'THYAO', name: 'Türk Hava Yolları' },
      { symbol: 'BIST100', name: 'BIST 100 Endeksi' },
      { symbol: 'AKBNK', name: 'Akbank' },
      { symbol: 'GARAN', name: 'Garanti BBVA' },
      { symbol: 'ISCTR', name: 'İş Bankası' },
      { symbol: 'TUPRS', name: 'Tüpraş' },
      { symbol: 'ASELS', name: 'Aselsan' },
      { symbol: 'KCHOL', name: 'Koç Holding' },
      { symbol: 'TCELL', name: 'Turkcell' },
      { symbol: 'ARCLK', name: 'Arçelik' },
    ],
    CRYPTO: [
      { symbol: 'BTC', name: 'Bitcoin' },
      { symbol: 'ETH', name: 'Ethereum' },
      { symbol: 'BNB', name: 'Binance Coin' },
      { symbol: 'ADA', name: 'Cardano' },
      { symbol: 'SOL', name: 'Solana' },
      { symbol: 'XRP', name: 'Ripple' },
      { symbol: 'DOT', name: 'Polkadot' },
      { symbol: 'AVAX', name: 'Avalanche' },
      { symbol: 'MATIC', name: 'Polygon' },
      { symbol: 'LINK', name: 'Chainlink' },
    ],
    FOREX: [
      { symbol: 'USD/TRY', name: 'Amerikan Doları' },
      { symbol: 'EUR/TRY', name: 'Euro' },
      { symbol: 'GBP/TRY', name: 'İngiliz Sterlini' },
      { symbol: 'JPY/TRY', name: 'Japon Yeni' },
      { symbol: 'CHF/TRY', name: 'İsviçre Frangı' },
      { symbol: 'CAD/TRY', name: 'Kanada Doları' },
      { symbol: 'AUD/TRY', name: 'Avustralya Doları' },
      { symbol: 'SEK/TRY', name: 'İsveç Kronu' },
      { symbol: 'NOK/TRY', name: 'Norveç Kronu' },
      { symbol: 'DKK/TRY', name: 'Danimarka Kronu' },
    ]
  };

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
        setStockAccounts(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedAccount(response.data.data[0]);
        }
      }
    } catch (error) {
      console.error('Hisse senedi hesapları alınamadı:', error);
      Alert.alert('Hata', 'Hesap bilgileri yüklenirken bir hata oluştu');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const selectPopularStock = (stock) => {
    setFormData(prev => ({
      ...prev,
      stockSymbol: stock.symbol,
      name: stock.name
    }));
  };

  const handleAssetTypeChange = (type) => {
    setAssetType(type);
    setFormData(prev => ({
      ...prev,
      assetType: type,
      stockSymbol: '',
      name: ''
    }));
  };

  const getAssetTypeIcon = (type) => {
    switch (type) {
      case 'STOCK': return 'chart-line';
      case 'CRYPTO': return 'bitcoin';
      case 'FOREX': return 'currency-usd';
      default: return 'chart-line';
    }
  };

  const getAssetTypeLabel = (type) => {
    switch (type) {
      case 'STOCK': return '📈 Hisse Senedi';
      case 'CRYPTO': return '₿ Kripto Para';
      case 'FOREX': return '💱 Döviz';
      default: return '📈 Hisse Senedi';
    }
  };

  const getPopularSectionTitle = (type) => {
    switch (type) {
      case 'STOCK': return '⭐ Popüler Hisse Senetleri';
      case 'CRYPTO': return '₿ Popüler Kripto Paralar';
      case 'FOREX': return '💱 Popüler Döviz Çiftleri';
      default: return '⭐ Popüler Varlıklar';
    }
  };

  const getSymbolLabel = (type) => {
    switch (type) {
      case 'STOCK': return '📈 Hisse Senedi Sembolü';
      case 'CRYPTO': return '₿ Kripto Para Sembolü';
      case 'FOREX': return '💱 Döviz Çifti';
      default: return '📈 Sembol';
    }
  };

  const getNameLabel = (type) => {
    switch (type) {
      case 'STOCK': return '🏢 Şirket Adı';
      case 'CRYPTO': return '🪙 Kripto Para Adı';
      case 'FOREX': return '🌍 Döviz Adı';
      default: return '🏢 Ad';
    }
  };

  const getSymbolPlaceholder = (type) => {
    switch (type) {
      case 'STOCK': return 'Örn: THYAO';
      case 'CRYPTO': return 'Örn: BTC';
      case 'FOREX': return 'Örn: USD/TRY';
      default: return 'Sembol girin';
    }
  };

  const getNamePlaceholder = (type) => {
    switch (type) {
      case 'STOCK': return 'Örn: Türk Hava Yolları';
      case 'CRYPTO': return 'Örn: Bitcoin';
      case 'FOREX': return 'Örn: Amerikan Doları';
      default: return 'Ad girin';
    }
  };

  const validateForm = () => {
    if (!selectedAccount) {
      Alert.alert('Hata', 'Lütfen bir hesap seçin');
      return false;
    }
    if (!formData.stockSymbol.trim()) {
      Alert.alert('Hata', 'Lütfen hisse senedi sembolü girin');
      return false;
    }
    if (!formData.name.trim()) {
      Alert.alert('Hata', 'Lütfen hisse senedi adını girin');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir fiyat girin');
      return false;
    }
    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir miktar girin');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const transactionData = {
        id: 0,
        stockAccountId: selectedAccount.id,
        stockSymbol: formData.stockSymbol.toUpperCase(),
        type: transactionType,
        assetType: assetType,
        name: formData.name,
        status: formData.status,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        date: new Date().toISOString()
      };

      const response = await api.post('/StockTransaction/add', transactionData);
      
      if (response.data) {
        // Calculate the transaction amount
        const transactionAmount = parseFloat(formData.price) * parseInt(formData.quantity);
        
        // Calculate new balance based on transaction type
        let newBalance = parseFloat(selectedAccount.balance);
        if (transactionType === 'BUY') {
          newBalance += transactionAmount; // Increase balance for buy
        } else {
          newBalance -= transactionAmount; // Decrease balance for sell
        }

        // Update stock account balance
        const updateData = {
          id: selectedAccount.id,
          userId: selectedAccount.userId,
          exchangeId: selectedAccount.exchangeId,
          accountNo: selectedAccount.accountNo,
          balance: newBalance,
          currency: selectedAccount.currency,
          updatedAt: new Date().toISOString()
        };

        const updateResponse = await api.post('/StockAcount/update', updateData);

        if (updateResponse.data.success) {
          const assetTypeText = assetType === 'STOCK' ? 'Hisse Senedi' : assetType === 'CRYPTO' ? 'Kripto Para' : 'Döviz';
          Alert.alert(
            'Başarılı',
            `${assetTypeText} ${transactionType === 'BUY' ? 'alış' : 'satış'} işlemi başarıyla eklendi!\n\nYeni bakiye: ${formatCurrency(newBalance, selectedAccount.currency)}`,
            [
              {
                text: 'Tamam',
                onPress: () => navigation.goBack()
              }
            ]
          );
        } else {
          Alert.alert('Uyarı', 'İşlem eklendi ancak hesap bakiyesi güncellenemedi');
        }
      }
    } catch (error) {
      console.error('İşlem eklenirken hata:', error);
      Alert.alert('Hata', 'İşlem eklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount, currency = 'TRY') => {
    if (isNaN(amount)) return '₺0,00';
    const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₺';
    return symbol + Number(amount).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const calculateTotal = () => {
    const price = parseFloat(formData.price) || 0;
    const quantity = parseInt(formData.quantity) || 0;
    return price * quantity;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>📊 Yeni İşlem Ekle</Text>
          <Text style={styles.headerSubtitle}>
            {getAssetTypeLabel(assetType)} alış veya satış işlemi ekleyin
          </Text>
        </View>

        {/* Hesap Seçimi */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>🏦 Hesap Seçimi</Text>
          <TouchableOpacity
            style={styles.accountSelector}
            onPress={() => setShowAccountModal(true)}
          >
            <View style={styles.accountSelectorContent}>
              {selectedAccount ? (
                <>
                  <View style={styles.accountInfo}>
                    <Text style={styles.accountNumber}>#{selectedAccount.accountNo}</Text>
                    <Text style={styles.accountBalance}>
                      {formatCurrency(selectedAccount.balance, selectedAccount.currency)}
                    </Text>
                  </View>
                  <Icon name="chevron-down" size={24} color="#64748B" />
                </>
              ) : (
                <>
                  <Text style={styles.placeholderText}>Hesap seçin</Text>
                  <Icon name="chevron-down" size={24} color="#64748B" />
                </>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* İşlem Tipi */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>📈 İşlem Tipi</Text>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[styles.typeButton, transactionType === 'BUY' && styles.typeButtonActive]}
              onPress={() => setTransactionType('BUY')}
            >
              <Icon 
                name="arrow-up-circle" 
                size={24} 
                color={transactionType === 'BUY' ? '#FFFFFF' : '#10B981'} 
              />
              <Text style={[styles.typeButtonText, transactionType === 'BUY' && styles.typeButtonTextActive]}>
                🛒 Alış
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.typeButton, transactionType === 'SOLD' && styles.typeButtonActive]}
              onPress={() => setTransactionType('SOLD')}
            >
              <Icon 
                name="arrow-down-circle" 
                size={24} 
                color={transactionType === 'SOLD' ? '#FFFFFF' : '#EF4444'} 
              />
              <Text style={[styles.typeButtonText, transactionType === 'SOLD' && styles.typeButtonTextActive]}>
                💸 Satış
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Varlık Tipi Seçimi */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>🎯 Varlık Tipi</Text>
          <View style={styles.assetTypeSelector}>
            <TouchableOpacity
              style={[styles.assetTypeButton, assetType === 'STOCK' && styles.assetTypeButtonActive]}
              onPress={() => handleAssetTypeChange('STOCK')}
            >
              <Icon 
                name={getAssetTypeIcon('STOCK')} 
                size={20} 
                color={assetType === 'STOCK' ? '#FFFFFF' : '#3B82F6'} 
              />
              <Text style={[styles.assetTypeButtonText, assetType === 'STOCK' && styles.assetTypeButtonTextActive]}>
                📈 Hisse
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.assetTypeButton, assetType === 'CRYPTO' && styles.assetTypeButtonActive]}
              onPress={() => handleAssetTypeChange('CRYPTO')}
            >
              <Icon 
                name={getAssetTypeIcon('CRYPTO')} 
                size={20} 
                color={assetType === 'CRYPTO' ? '#FFFFFF' : '#F59E0B'} 
              />
              <Text style={[styles.assetTypeButtonText, assetType === 'CRYPTO' && styles.assetTypeButtonTextActive]}>
                ₿ Kripto
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.assetTypeButton, assetType === 'FOREX' && styles.assetTypeButtonActive]}
              onPress={() => handleAssetTypeChange('FOREX')}
            >
              <Icon 
                name={getAssetTypeIcon('FOREX')} 
                size={20} 
                color={assetType === 'FOREX' ? '#FFFFFF' : '#10B981'} 
              />
              <Text style={[styles.assetTypeButtonText, assetType === 'FOREX' && styles.assetTypeButtonTextActive]}>
                💱 Döviz
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Popüler Varlıklar */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{getPopularSectionTitle(assetType)}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.popularStocksContainer}>
            {popularAssets[assetType].map((asset, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.popularStockButton,
                  formData.stockSymbol === asset.symbol && styles.popularStockButtonActive
                ]}
                onPress={() => selectPopularStock(asset)}
              >
                <Text style={[
                  styles.popularStockSymbol,
                  formData.stockSymbol === asset.symbol && styles.popularStockSymbolActive
                ]}>
                  {asset.symbol}
                </Text>
                <Text style={[
                  styles.popularStockName,
                  formData.stockSymbol === asset.symbol && styles.popularStockNameActive
                ]}>
                  {asset.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Varlık Bilgileri */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>📋 {getAssetTypeLabel(assetType)} Bilgileri</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{getSymbolLabel(assetType)}</Text>
            <TextInput
              style={styles.input}
              value={formData.stockSymbol}
              onChangeText={(value) => handleInputChange('stockSymbol', assetType === 'FOREX' ? value : value.toUpperCase())}
              placeholder={getSymbolPlaceholder(assetType)}
              placeholderTextColor="#94A3B8"
              autoCapitalize={assetType === 'FOREX' ? 'none' : 'characters'}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{getNameLabel(assetType)}</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder={getNamePlaceholder(assetType)}
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* İşlem Detayları */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>💰 İşlem Detayları</Text>
          
          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>💵 Birim Fiyat</Text>
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={(value) => handleInputChange('price', value)}
                placeholder="0.00"
                placeholderTextColor="#94A3B8"
                keyboardType="decimal-pad"
              />
            </View>
            
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>📦 Miktar</Text>
              <TextInput
                style={styles.input}
                value={formData.quantity}
                onChangeText={(value) => handleInputChange('quantity', value)}
                placeholder="0"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Toplam Tutar */}
          {(formData.price && formData.quantity) && (
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>💎 Toplam Tutar</Text>
              <Text style={[styles.totalAmount, { 
                color: transactionType === 'BUY' ? '#10B981' : '#EF4444' 
              }]}>
                {formatCurrency(calculateTotal(), selectedAccount?.currency)}
              </Text>
            </View>
          )}
        </View>

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: transactionType === 'BUY' ? '#10B981' : '#EF4444' },
              loading && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Icon 
                  name={transactionType === 'BUY' ? 'arrow-up-circle' : 'arrow-down-circle'} 
                  size={24} 
                  color="#FFFFFF" 
                />
                <Text style={styles.submitButtonText}>
                  {transactionType === 'BUY' ? '🛒' : '💸'} {getAssetTypeLabel(assetType)} {transactionType === 'BUY' ? 'Alış' : 'Satış'} İşlemi Ekle
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Hesap Seçim Modal */}
      <Modal
        visible={showAccountModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAccountModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🏦 Hesap Seçin</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowAccountModal(false)}
              >
                <Icon name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={stockAccounts}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.accountOption,
                    selectedAccount?.id === item.id && styles.accountOptionActive
                  ]}
                  onPress={() => {
                    setSelectedAccount(item);
                    setShowAccountModal(false);
                  }}
                >
                  <View style={styles.accountOptionContent}>
                    <Text style={styles.accountOptionNumber}>#{item.accountNo}</Text>
                    <Text style={styles.accountOptionBalance}>
                      {formatCurrency(item.balance, item.currency)}
                    </Text>
                  </View>
                  <Text style={styles.accountOptionExchange}>
                    {item.exchangeName || `Exchange ${item.exchangeId}`}
                  </Text>
                  {selectedAccount?.id === item.id && (
                    <Icon name="check-circle" size={24} color="#10B981" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddStockTransactionScreen; 