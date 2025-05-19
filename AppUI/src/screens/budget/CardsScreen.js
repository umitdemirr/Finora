import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

const CardsScreen = ({ navigation }) => {
  const [bankCards, setBankCards] = useState([]);
  const [creditCards, setCreditCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Hata', 'Kullanıcı bilgileri alınamadı');
        return;
      }

      // Banka kartlarını getir
      const bankResponse = await api.get(`/BankCard/getdetail?userId=${userId}`);
      if (bankResponse.data.success && bankResponse.data.data) {
        setBankCards(bankResponse.data.data);
      }

      // Kredi kartlarını getir
      const creditResponse = await api.get(`/CreditCard/getdetail?userId=${userId}`);
      if (creditResponse.data.success && creditResponse.data.data) {
        setCreditCards(creditResponse.data.data);
      }
    } catch (error) {
      console.error('Kart bilgileri alınamadı:', error);
      Alert.alert('Hata', 'Kart bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (number) => {
    if (!number) return '';
    return number.replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatAmount = (amount) => {
    return parseFloat(amount).toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kartlarım</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="plus" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Kredi Kartları */}
      {creditCards.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kredi Kartlarım</Text>
          {creditCards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={styles.creditCardContainer}
              onPress={() => navigation.navigate('CardDetail', { card })}
            >
              <View style={styles.creditCardHeader}>
                <View style={styles.bankInfo}>
                  <Icon name="bank" size={20} color="#666" />
                  <Text style={styles.bankName}>{card.bankName}</Text>
                </View>
                <Icon 
                  name={card.provider === 'VISA' ? 'credit-card' : 'credit-card-outline'} 
                  size={24} 
                  color="#FF6B6B" 
                />
              </View>

              <View style={styles.creditCardBody}>
                <Text style={styles.creditCardName}>{card.name}</Text>
                <Text style={styles.creditCardNumber}>{formatCardNumber(card.cardNumber)}</Text>
                <View style={styles.creditCardFooter}>
                  <View style={styles.creditCardInfo}>
                    <Text style={styles.creditCardInfoLabel}>Son Kullanma</Text>
                    <Text style={styles.creditCardInfoValue}>{card.expiryDate}</Text>
                  </View>
                  <View style={styles.creditCardInfo}>
                    <Text style={styles.creditCardInfoLabel}>Limit</Text>
                    <Text style={styles.creditCardInfoValue}>{formatAmount(card.limit)} ₺</Text>
                  </View>
                  <View style={styles.creditCardInfo}>
                    <Text style={styles.creditCardInfoLabel}>Kullanılabilir</Text>
                    <Text style={styles.creditCardInfoValue}>{formatAmount(card.avaliableLimit)} ₺</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Banka Kartları */}
      {bankCards.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Banka Kartlarım</Text>
          {bankCards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={styles.cardContainer}
              onPress={() => navigation.navigate('CardDetail', { card })}
            >
              <View style={styles.cardHeader}>
                <View style={styles.bankInfo}>
                  <Icon name="bank" size={20} color="#666" />
                  <Text style={styles.bankName}>{card.bankName}</Text>
                </View>
                <Icon 
                  name={card.provider === 'VISA' ? 'credit-card' : 'credit-card-outline'} 
                  size={24} 
                  color="#007AFF" 
                />
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.cardName}>{card.cardName}</Text>
                <Text style={styles.cardNumber}>{formatCardNumber(card.cardNumber)}</Text>
                <View style={styles.cardFooter}>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardInfoLabel}>Son Kullanma</Text>
                    <Text style={styles.cardInfoValue}>{card.expiryDate}</Text>
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardInfoLabel}>Hesap</Text>
                    <Text style={styles.cardInfoValue}>{card.accountName}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {bankCards.length === 0 && creditCards.length === 0 && (
        <View style={styles.emptyContainer}>
          <Icon name="credit-card-off" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Henüz kartınız bulunmuyor</Text>
        </View>
      )}

      {/* Kart Ekleme Seçenekleri Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Kart Ekle</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('AddCard');
              }}
            >
              <Icon name="credit-card" size={24} color="#2196F3" />
              <Text style={styles.modalOptionText}>Banka Kartı Ekle</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('AddCreditCard');
              }}
            >
              <Icon name="credit-card-outline" size={24} color="#2196F3" />
              <Text style={styles.modalOptionText}>Kredi Kartı Ekle</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  // Banka Kartı Stilleri
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankName: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  cardBody: {
    marginTop: 8,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardNumber: {
    fontSize: 20,
    color: '#333',
    letterSpacing: 2,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardInfo: {
    flex: 1,
  },
  cardInfoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  cardInfoValue: {
    fontSize: 14,
    color: '#333',
  },
  // Kredi Kartı Stilleri
  creditCardContainer: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  creditCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  creditCardBody: {
    marginTop: 8,
  },
  creditCardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  creditCardNumber: {
    fontSize: 20,
    color: '#fff',
    letterSpacing: 2,
    marginBottom: 16,
  },
  creditCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  creditCardInfo: {
    flex: 1,
  },
  creditCardInfoLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  creditCardInfoValue: {
    fontSize: 14,
    color: '#fff',
  },
  // Modal Stilleri
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxWidth: 4000,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
});

export default CardsScreen; 