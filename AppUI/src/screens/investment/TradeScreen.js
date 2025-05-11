import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TradeScreen = ({ route, navigation }) => {
  const { type, asset } = route.params;
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState(asset.currentPrice.toString());
  const [total, setTotal] = useState(0);
  const [commission, setCommission] = useState(0);
  const [netTotal, setNetTotal] = useState(0);
  const [balance] = useState(250000); // Örnek bakiye

  useEffect(() => {
    calculateTotals();
  }, [quantity, price]);

  const calculateTotals = () => {
    const quantityNum = parseFloat(quantity) || 0;
    const priceNum = parseFloat(price) || 0;
    const totalAmount = quantityNum * priceNum;
    const commissionAmount = totalAmount * 0.001; // %0.1 komisyon
    const netTotalAmount = type === 'buy' 
      ? totalAmount + commissionAmount 
      : totalAmount - commissionAmount;

    setTotal(totalAmount);
    setCommission(commissionAmount);
    setNetTotal(netTotalAmount);
  };

  const validateOrder = () => {
    if (!quantity || !price) {
      Alert.alert('Uyarı', 'Lütfen miktar ve fiyat bilgilerini girin.');
      return false;
    }

    const quantityNum = parseFloat(quantity);
    const priceNum = parseFloat(price);

    if (isNaN(quantityNum) || quantityNum <= 0) {
      Alert.alert('Uyarı', 'Geçerli bir miktar girin.');
      return false;
    }

    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Uyarı', 'Geçerli bir fiyat girin.');
      return false;
    }

    if (type === 'buy' && netTotal > balance) {
      Alert.alert('Uyarı', 'Yetersiz bakiye.');
      return false;
    }

    if (type === 'sell' && quantityNum > asset.quantity) {
      Alert.alert('Uyarı', 'Yetersiz varlık miktarı.');
      return false;
    }

    return true;
  };

  const handleOrder = () => {
    if (!validateOrder()) return;

    Alert.alert(
      'Emir Onayı',
      `${type === 'buy' ? 'Alış' : 'Satış'} emrini onaylıyor musunuz?\n\n` +
      `Varlık: ${asset.symbol}\n` +
      `Miktar: ${quantity}\n` +
      `Fiyat: ₺${parseFloat(price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}\n` +
      `Toplam: ₺${total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}\n` +
      `Komisyon: ₺${commission.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}\n` +
      `Net Toplam: ₺${netTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`,
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Onayla',
          onPress: () => {
            // Burada emir işlemi gerçekleştirilecek
            Alert.alert(
              'Başarılı',
              'Emir başarıyla iletildi.',
              [
                {
                  text: 'Tamam',
                  onPress: () => navigation.goBack(),
                },
              ],
            );
          },
        },
      ],
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
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

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Miktar</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="decimal-pad"
                placeholder="0.00"
              />
              <Text style={styles.inputSuffix}>{asset.symbol}</Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Fiyat</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputPrefix}>₺</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
                placeholder="0.00"
              />
            </View>
          </View>

          <View style={styles.quickButtons}>
            {[-5, -1, 1, 5].map((percent) => (
              <TouchableOpacity
                key={percent}
                style={styles.quickButton}
                onPress={() => {
                  const currentPrice = parseFloat(price) || asset.currentPrice;
                  const newPrice = currentPrice * (1 + percent / 100);
                  setPrice(newPrice.toFixed(2));
                }}
              >
                <Text style={styles.quickButtonText}>
                  {percent > 0 ? '+' : ''}{percent}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Toplam</Text>
              <Text style={styles.summaryValue}>
                ₺{total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Komisyon (%0.1)</Text>
              <Text style={styles.summaryValue}>
                ₺{commission.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.netTotalRow]}>
              <Text style={styles.summaryLabel}>Net Toplam</Text>
              <Text style={styles.netTotalValue}>
                ₺{netTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </View>

          <View style={styles.balanceInfo}>
            <Icon name="wallet" size={20} color="#666" />
            <Text style={styles.balanceText}>
              Kullanılabilir Bakiye: ₺{balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.orderButton,
            type === 'buy' ? styles.buyButton : styles.sellButton,
          ]}
          onPress={handleOrder}
        >
          <Icon
            name={type === 'buy' ? 'plus' : 'minus'}
            size={24}
            color="#FFF"
          />
          <Text style={styles.orderButtonText}>
            {type === 'buy' ? 'Alış Emri Ver' : 'Satış Emri Ver'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flexGrow: 1,
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
  form: {
    backgroundColor: '#FFF',
    padding: 16,
    marginTop: 16,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
  },
  inputPrefix: {
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#666',
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 12,
  },
  inputSuffix: {
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#666',
  },
  quickButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  quickButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  summary: {
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  netTotalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  netTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  balanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 8,
  },
  balanceText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  footer: {
    backgroundColor: '#FFF',
    padding: 16,
    elevation: 4,
  },
  orderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
  },
  buyButton: {
    backgroundColor: '#4CAF50',
  },
  sellButton: {
    backgroundColor: '#F44336',
  },
  orderButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default TradeScreen;