import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TransfersScreen = () => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const recentContacts = [
    { id: '1', name: 'Ahmet Yılmaz', iban: 'TR12 3456 7890 1234' },
    { id: '2', name: 'Ayşe Demir', iban: 'TR98 7654 3210 9876' },
    { id: '3', name: 'Mehmet Kaya', iban: 'TR45 6789 0123 4567' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.transferForm}>
        <Text style={styles.sectionTitle}>Para Transferi</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tutar</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="₺0.00"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Alıcı IBAN</Text>
          <TextInput
            style={styles.input}
            value={recipient}
            onChangeText={setRecipient}
            placeholder="TR__ ____ ____ ____"
          />
        </View>

        <TouchableOpacity style={styles.transferButton}>
          <Text style={styles.transferButtonText}>Transfer Yap</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quickTransfer}>
        <Text style={styles.sectionTitle}>Hızlı Transfer</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recentContacts.map((contact) => (
            <TouchableOpacity key={contact.id} style={styles.contactCard}>
              <View style={styles.contactAvatar}>
                <Icon name="account" size={32} color="#ffffff" />
              </View>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactIban}>{contact.iban}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.transferTypes}>
        <TouchableOpacity style={styles.transferTypeButton}>
          <Icon name="bank" size={24} color="#007AFF" />
          <Text style={styles.transferTypeText}>Banka Transferi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.transferTypeButton}>
          <Icon name="cash-fast" size={24} color="#007AFF" />
          <Text style={styles.transferTypeText}>Hızlı Transfer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.transferTypeButton}>
          <Icon name="clock-outline" size={24} color="#007AFF" />
          <Text style={styles.transferTypeText}>İleri Tarihli</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  transferForm: {
    backgroundColor: '#ffffff',
    padding: 20,
    margin: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  transferButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  transferButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickTransfer: {
    padding: 20,
  },
  contactCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginRight: 16,
    borderRadius: 12,
    width: 150,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  contactIban: {
    fontSize: 12,
    color: '#666',
  },
  transferTypes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#ffffff',
    marginTop: 20,
  },
  transferTypeButton: {
    alignItems: 'center',
  },
  transferTypeText: {
    marginTop: 8,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
});

export default TransfersScreen; 