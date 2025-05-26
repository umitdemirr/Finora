import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { CardsStyles as styles } from '../../styles/CardScreenStyles';
import { useFocusEffect } from '@react-navigation/native';

const CardsScreen = ({ navigation }) => {
  const [bankCards, setBankCards] = useState([]);
  const [creditCards, setCreditCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Ekrana her geldiğinde kartları yenile
  useFocusEffect(
    React.useCallback(() => {
      fetchCards();
    }, [])
  );

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
      console.error('ERROR - Could not fetch cards:', error);
      Alert.alert('Hata', 'Kart bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (number) => {
    if (!number) return '';
    return number.replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatCurrency = (amount) => {
    if (isNaN(amount)) return '₺0,00';
    return '₺' + Number(amount).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
          <View style={styles.cardsGrid}>
            {creditCards.map((card) => (
              <TouchableOpacity
                key={card.id}
                style={styles.creditCardContainer}
                onPress={() => navigation.navigate('CardDetail', { card })}
              >
                <View style={styles.creditCardHeader}>
                  <View style={styles.bankInfo}>
                    <Icon name="bank" size={20} color="#FFFFFF" />
                    <Text style={[styles.bankName, { color: '#FFFFFF' }]}>{card.bankName}</Text>
                  </View>
                  <Icon 
                    name={card.provider === 'VISA' ? 'credit-card' : 'credit-card-outline'} 
                    size={24} 
                    color="#FFFFFF" 
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
                      <Text style={styles.creditCardInfoValue}>{formatCurrency(card.limit)}</Text>
                    </View>
                    <View style={styles.creditCardInfo}>
                      <Text style={styles.creditCardInfoLabel}>Kullanılabilir</Text>
                      <Text style={styles.creditCardInfoValue}>{formatCurrency(card.avaliableLimit)}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Banka Kartları */}
      {bankCards.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Banka Kartlarım</Text>
          <View style={styles.cardsGrid}>
            {bankCards.map((card) => (
              <TouchableOpacity
                key={card.id}
                style={styles.bankCardContainer}
                onPress={() => {}}
              >
                <View style={styles.bankCardHeader}>
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

                <View style={styles.bankCardBody}>
                  <Text style={styles.bankCardName}>{card.cardName}</Text>
                  <Text style={styles.bankCardNumber}>{formatCardNumber(card.cardNumber)}</Text>
                  <View style={styles.bankCardFooter}>
                    <View style={styles.bankCardInfo}>
                      <Text style={styles.bankCardInfoLabel}>Son Kullanma</Text>
                      <Text style={styles.bankCardInfoValue}>{card.expiryDate}</Text>
                    </View>
                    <View style={styles.bankCardInfo}>
                      <Text style={styles.bankCardInfoLabel}>Hesap</Text>
                      <Text style={styles.bankCardInfoValue}>{card.accountName}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
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

export default CardsScreen; 