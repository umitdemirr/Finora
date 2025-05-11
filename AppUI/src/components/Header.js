import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Header = ({ balance, userName }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.greeting}>Merhaba, {userName}</Text>
      <Text style={styles.balance}>₺{balance}</Text>
      <Text style={styles.balanceLabel}>Toplam Varlık</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greeting: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 8,
  },
  balance: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  balanceLabel: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.8,
  },
});

export default Header; 