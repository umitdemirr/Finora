import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const QuickActions = ({ onActionPress }) => {
  const actions = [
    { id: 'transfer', icon: 'bank-transfer', label: 'Transfer' },
    { id: 'qr', icon: 'qrcode-scan', label: 'QR Kod' },
    { id: 'cards', icon: 'credit-card', label: 'Kartlarım' },
    { id: 'payments', icon: 'format-list-bulleted', label: 'Ödemeler' },
  ];

  return (
    <View style={styles.quickActions}>
      {actions.map((action) => (
        <TouchableOpacity
          key={action.id}
          style={styles.actionButton}
          onPress={() => onActionPress(action.id)}
        >
          <Icon name={action.icon} size={24} color="#007AFF" />
          <Text style={styles.actionText}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    color: '#333',
  },
});

export default QuickActions; 