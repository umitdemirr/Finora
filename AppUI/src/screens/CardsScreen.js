import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../services/api';

const CardItem = ({ card }) => {
  // Kredi kartı numarasını maskeleme (sadece son 4 haneyi göster)
  const maskedNumber = `**** **** **** ${card.cardNumber.slice(-4)}`;

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardType}>{card.cardType}</Text>
        <Icon 
          name={card.cardType === 'Kredi Kartı' ? 'credit-card' : 'card-outline'} 
          size={24} 
          color="#007AFF" 
        />
      </View>
      <Text style={styles.cardNumber}>{maskedNumber}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.expiryDate}>Son Kullanma: {card.expiryDate}</Text>
        <Text style={styles.cvv}>CVV: ***</Text>
      </View>
    </View>
  );
};

const CardsScreen = ({ navigation }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchCards = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await api.get('/BankCard/getall');
      if (response.data.success) {
        setCards(response.data.data);
        setError(null);
      } else {
        setError(response.data.message || 'Kartlar yüklenirken bir hata oluştu.');
      }
    } catch (error) {
      setError(error.message || 'Kartlar yüklenirken bir hata oluştu.');
      if (error.response?.status === 401) {
        navigation.replace('Login');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCards(false);
  };

  useEffect(() => {
    fetchCards();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cards}
        renderItem={({ item }) => <CardItem card={item} />}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
        ListEmptyComponent={
          error ? (
            <View style={styles.centerContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={() => fetchCards()}>
                <Text style={styles.retryButtonText}>Tekrar Dene</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>Henüz kart bulunmuyor.</Text>
            </View>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContainer: {
    padding: 16,
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  cardNumber: {
    fontSize: 20,
    letterSpacing: 2,
    marginBottom: 16,
    color: '#333',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expiryDate: {
    fontSize: 14,
    color: '#666',
  },
  cvv: {
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default CardsScreen; 