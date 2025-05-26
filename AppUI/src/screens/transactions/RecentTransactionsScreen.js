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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { Picker } from '@react-native-picker/picker';
import { RecentTransactionsStyles as styles } from '../../styles/RecentTransactionsStyles';

export const handleAddTransaction = async (newTransaction, setModalVisible, setNewTransaction, fetchTransactions, account) => {
  try {
    if (!newTransaction.amount || !newTransaction.description) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    // UserId'yi al
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      Alert.alert('Hata', 'Kullanıcı bilgileri alınamadı');
      return;
    }

    // Tutarı her zaman pozitif olarak gönder
    const amount = Math.abs(parseFloat(newTransaction.amount));

    // Kredi kartı seçiliyse işlem tipini Debit olarak değiştir
    const transactionType = newTransaction.paymentType && newTransaction.paymentType.startsWith('CREDIT_') ? 'Debit' : newTransaction.transactionType;

    // Kredi kartı işlemi ise limit kontrolü yap
    let creditCard = null;
    if (transactionType === 'Debit' && newTransaction.paymentType && newTransaction.paymentType.startsWith('CREDIT_')) {
      const cardId = newTransaction.paymentType.split('_')[1];
      
      try {
        // Kredi kartı bilgilerini al
        const cardResponse = await api.get(`/CreditCard/getdetail?userId=${userId}`);
        if (cardResponse.data.success && cardResponse.data.data) {
          creditCard = cardResponse.data.data.find(card => card.id == cardId);
          
          if (creditCard) {
            // Kullanılabilir limit kontrolü
            if (amount > creditCard.avaliableLimit) {
              Alert.alert(
                'Limit Aşıldı', 
                `Bu işlem kullanılabilir limitinizi aşmaktadır.\n\n` +
                `İşlem tutarı: ₺${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}\n` +
                `Kullanılabilir limit: ₺${creditCard.avaliableLimit.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}\n` +
                `Kart limiti: ₺${creditCard.limit.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`
              );
              return;
            }
          } else {
            Alert.alert('Hata', 'Kredi kartı bilgileri bulunamadı');
            return;
          }
        }
      } catch (cardError) {
        console.error('Kredi kartı bilgileri alınamadı:', cardError);
        Alert.alert('Hata', 'Kredi kartı bilgileri kontrol edilemedi');
        return;
      }
    }

    // Gelir işlemlerinde kategoriyi otomatik "Banka Hesabı" olarak ayarla
    let finalCategory = newTransaction.category;
    if (newTransaction.transactionType === 'Gelir') {
      finalCategory = 'Banka Hesabı';
    }

    // PaymentType'ı düzenle - eğer Gelir işlemiyse "Banka Hesabı" olarak ayarla
    let finalPaymentType = newTransaction.paymentType;
    if (newTransaction.transactionType === 'Gelir') {
      finalPaymentType = 'Banka Hesabı';
    } else if (!finalPaymentType || finalPaymentType === '') {
      finalPaymentType = 'NAKIT';
    } else if (finalPaymentType.startsWith('CREDIT_')) {
      finalPaymentType = 'Kredi Kartı';
    } else if (finalPaymentType.startsWith('BANK_')) {
      finalPaymentType = 'Banka Kartı';
    }

    // Kart ile işlemde accountId'yi doğru belirle
    let finalAccountId = newTransaction.accountId;
    if (newTransaction.paymentType && newTransaction.paymentType.startsWith('BANK_')) {
      finalAccountId = newTransaction.paymentType.split('_')[1];
    } else if (newTransaction.paymentType && newTransaction.paymentType.startsWith('CREDIT_')) {
      finalAccountId = creditCard.id;
    }

    const requestData = {
      accountId: finalAccountId,
      userId: parseInt(userId),
      amount: amount,
      transactionType: transactionType,
      paymentType: finalPaymentType,
      type: finalCategory,
      category: finalCategory,
      description: newTransaction.description,
      currency: newTransaction.currency,
      date: newTransaction.date
    };

    // Sadece requestData'yı logla

    const response = await api.post('/BankTransaction/add', requestData);

    if (response.data.success) {
      // Kredi kartı limitini güncelle
      if (creditCard && transactionType === 'Debit') {
        try {
          const newAvailableLimit = creditCard.avaliableLimit - amount;
          
          const updateData = {
            id: creditCard.id,
            userId: parseInt(userId),
            bankId: creditCard.bankId,
            name: creditCard.name,
            provider: creditCard.provider,
            number: creditCard.cardNumber,
            expiryDate: creditCard.expiryDate,
            cvv: creditCard.cvv,
            limit: creditCard.limit,
            avaliableLimit: newAvailableLimit,
            statementClosingDate: creditCard.statementClosingDate,
            isActive: creditCard.isActive,
            createdAt: creditCard.createdAt,
            updatedAt: creditCard.updatedAt
          };

          const updateResponse = await api.post('/CreditCard/update', updateData);
          
          if (updateResponse.data.success) {
            Alert.alert(
              'Başarılı', 
              `İşlem başarıyla eklendi.\n\n` +
              `${creditCard.name} kartının yeni kullanılabilir limiti: ₺${newAvailableLimit.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`
            );
          } else {
            Alert.alert('Uyarı', 'İşlem eklendi ancak kredi kartı limiti güncellenemedi');
          }
        } catch (updateError) {
          console.error('Kredi kartı güncelleme hatası:', updateError);
          Alert.alert('Uyarı', 'İşlem eklendi ancak kredi kartı limiti güncellenemedi');
        }
      } else {
        Alert.alert('Başarılı', 'İşlem başarıyla eklendi');
      }
      
      // İşlem eklendikten sonra hesap bakiyesini güncelle
      try {
        if (account && account.accountId) {
          // Yeni bakiyeyi hesapla
          let newBalance = parseFloat(account.balance) || 0;
          const oldBalance = newBalance;
          
          if (transactionType === 'Gelir') {
            newBalance += amount;
          } else if (transactionType === 'Gider') {
            newBalance -= amount;
          } else if (transactionType === 'Debit') {
            // Debit işlemleri hesap bakiyesini etkilemez
          }
          
          // Hesap bakiyesini API'de güncelle
          const updateData = {
            id: account.accountId,
            userId: parseInt(userId),
            bankId: account.bankId,
            accountNo: account.iban,
            currencyId: account.currencyId,
            balance: newBalance,
            name: account.accountName
          };
          
          const updateResponse = await api.post('/BankAccount/update', updateData);
          
          if (updateResponse.data.success) {
            // Local account objesini de güncelle
            account.balance = newBalance;
          } else {
            console.error('Account balance update failed:', updateResponse.data);
          }
        }
      } catch (balanceError) {
        console.error('Error updating account balance:', balanceError);
      }
      
      setModalVisible(false);
      setNewTransaction({
        accountId: account.accountId,
        category: 'Havale',
        transactionType: 'Gelir',
        paymentType: 'Banka Hesabı',
        amount: '',
        currency: account.currencyName,
        description: '',
        date: new Date().toISOString(),
      });
      fetchTransactions();
    } else {
      Alert.alert('Hata', 'İşlem eklenirken bir hata oluştu');
    }
  } catch (error) {
    console.error('İşlem eklenemedi:', error);
    Alert.alert('Hata', 'İşlem eklenirken bir hata oluştu');
  }
};

const RecentTransactionsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    accountId: '',
    category: '',
    transactionType: '',
    paymentType: '',
    amount: '',
    currency: '',
    description: '',
    date: new Date().toISOString(),
  });
  const [bankCards, setBankCards] = useState([]);
  const [creditCards, setCreditCards] = useState([]);

  const incomeCategories = [
    'Maaş',
    'Freelance',
    'Yatırım Geliri',
    'Kira Geliri',
    'Diğer Gelir'
  ];

  const expenseCategories = [
    'Market Alışverişi',
    'Yemek',
    'Ulaşım',
    'Eğlence',
    'Faturalar',
    'Sağlık',
    'Kira',
    'Diğer Gider'
  ];

  const currencies = [
    { code: 'TRY', symbol: '₺' },
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' }
  ];

  const filters = [
    { id: 'all', label: 'Tümü' },
    { id: 'income', label: 'Gelirler' },
    { id: 'expense', label: 'Giderler' },
    { id: 'debt', label: 'Borçlar' },
  ];

  useEffect(() => {
    fetchTransactions();
    fetchAccounts();
    fetchCards();
  }, []);

  const fetchAccounts = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Hata', 'Kullanıcı bilgileri alınamadı');
        return;
      }

      const response = await api.get(`/BankAccount/getdetailbyuserid?userId=${userId}`);
      if (response.data.success && response.data.data) {
        setAccounts(response.data.data);
        // İlk hesabı varsayılan olarak seç
        if (response.data.data.length > 0) {
          setNewTransaction(prev => ({
            ...prev,
            accountId: response.data.data[0].accountId
          }));
        }
      }
    } catch (error) {
      console.error('Hesap bilgileri alınamadı:', error);
      Alert.alert('Hata', 'Hesap bilgileri yüklenirken bir hata oluştu');
    }
  };

  const fetchTransactions = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Hata', 'Kullanıcı bilgileri alınamadı');
        return;
      }

      const response = await api.get(`/BankTransaction/getdetail?userId=${userId}`);
      if (response.data.success && response.data.data) {
        // API'den gelen verileri işle ve tutarları işlem tipine göre düzenle
        const processedTransactions = response.data.data.map(transaction => ({
          ...transaction,
          // İşlem tipine göre tutarı düzenle
          displayAmount: transaction.transactionType === 'Gider' ? -Math.abs(transaction.amount) : Math.abs(transaction.amount)
        }));
        setTransactions(processedTransactions);
      }
    } catch (error) {
      console.error('İşlem bilgileri alınamadı:', error);
      Alert.alert('Hata', 'İşlem bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

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
    }
  };

  const handleAddTransactionLocal = () => {
    // İşlem tipine göre kategori seçimini kontrol et
    if (newTransaction.transactionType === 'Gelir' && !incomeCategories.includes(newTransaction.category)) {
      Alert.alert('Hata', 'Lütfen gelir kategorisi seçin');
      return;
    }
    if (newTransaction.transactionType === 'Gider' && !expenseCategories.includes(newTransaction.category)) {
      Alert.alert('Hata', 'Lütfen gider kategorisi seçin');
      return;
    }
    
    // Kategori boş kontrolü
    if (!newTransaction.category || newTransaction.category === '') {
      Alert.alert('Hata', 'Lütfen kategori seçin');
      return;
    }
    
    handleAddTransaction(newTransaction, setModalVisible, setNewTransaction, fetchTransactions, accounts[0]);
  };

  const filteredTransactions = transactions.filter(t => {
    if (selectedFilter === 'income') return t.transactionType === 'Gelir';
    if (selectedFilter === 'expense') return t.transactionType === 'Gider';
    if (selectedFilter === 'debt') return t.transactionType === 'Debit';
    return t.transactionType !== 'Debit';
  });

  // Bakiye hesaplamasında Debit işlemlerini dahil etme
  const totalIncome = transactions.filter(t => t.transactionType === 'Gelir').reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = transactions.filter(t => t.transactionType === 'Gider').reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = totalIncome - totalExpense;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
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
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Üst Bilgi Kartı */}
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>Son İşlemler</Text>
        <Text style={styles.headerSubtitle}>
          {filteredTransactions.length} işlem bulundu
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Filtre Seçici */}
      <View style={styles.filterSelector}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              selectedFilter === filter.id && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === filter.id && styles.filterButtonTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Arama Çubuğu */}
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="İşlem ara..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* İşlem Listesi */}
      <ScrollView style={styles.transactionsList}>
        {filteredTransactions.map((transaction) => (
          <TouchableOpacity
            key={transaction.bankTransactionId}
            style={styles.transactionItem}
            onPress={() => {
              Alert.alert(
                transaction.description,
                `Tutar: ${formatAmount(Math.abs(transaction.amount))} ${transaction.currency}\n
                Tarih: ${formatDate(transaction.transactionDate)}\n
                Hesap: ${transaction.accountName}\n
                İşlem Tipi: ${transaction.transactionType}\n
                Kategori: ${transaction.type}
                `,
                [
                  {
                    text: 'Düzenle',
                    onPress: () => {
                      Alert.alert('Bilgi', 'Düzenleme özelliği yakında eklenecek.');
                    },
                  },
                  {
                    text: 'Kapat',
                    style: 'cancel',
                  },
                ]
              );
            }}
          >
            <View style={styles.transactionLeft}>
              <View
                style={[
                  styles.transactionIcon,
                  { backgroundColor: transaction.transactionType === 'Gelir' ? '#4CAF5020' : '#F4433620' },
                ]}
              >
                <Icon
                  name={transaction.transactionType === 'Gelir' ? 'arrow-up' : 'arrow-down'}
                  size={24}
                  color={transaction.transactionType === 'Gelir' ? '#4CAF50' : '#F44336'}
                />
              </View>
              <View style={styles.accountInfo}>
                <Text style={styles.accountName}>{transaction.accountName}</Text>
                <View style={[
                  styles.typeLabel,
                  { backgroundColor: transaction.transactionType === 'Gelir' ? '#4CAF5020' : '#F4433620' }
                ]}>
                  <Text style={[
                    styles.typeLabelText,
                    { color: transaction.transactionType === 'Gelir' ? '#4CAF50' : '#F44336' }
                  ]}>
                    {transaction.transactionType}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.transactionCenter}>
              <Text style={styles.transactionTitle}>{transaction.description}</Text>
              <Text style={styles.transactionDate}>{formatDate(transaction.transactionDate)}</Text>
            </View>

            <Text
              style={[
                styles.transactionAmount,
                {
                  color: transaction.transactionType === 'Gelir' ? '#4CAF50' : '#F44336',
                },
              ]}
            >
              {transaction.transactionType === 'Gelir' ? '+' : '-'}{formatAmount(Math.abs(transaction.amount))} {transaction.currency}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* İşlem Ekleme Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Yeni İşlem Ekle</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Hesap</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={newTransaction.accountId}
                    onValueChange={(value) =>
                      setNewTransaction({ ...newTransaction, accountId: value })
                    }
                    style={styles.picker}
                  >
                    {accounts.map((account) => (
                      <Picker.Item
                        key={account.accountId}
                        label={`${account.accountName} (${account.bankName})`}
                        value={account.accountId}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Açıklama</Text>
                <TextInput
                  style={styles.input}
                  value={newTransaction.description}
                  onChangeText={(text) =>
                    setNewTransaction({ ...newTransaction, description: text })
                  }
                  placeholder="İşlem açıklaması"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Tutar</Text>
                <TextInput
                  style={styles.input}
                  value={newTransaction.amount}
                  onChangeText={(text) =>
                    setNewTransaction({ ...newTransaction, amount: text })
                  }
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Para Birimi</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={newTransaction.currency}
                    onValueChange={(value) =>
                      setNewTransaction({ ...newTransaction, currency: value })
                    }
                    style={styles.picker}
                  >
                    {currencies.map((currency) => (
                      <Picker.Item
                        key={currency.code}
                        label={`${currency.code} (${currency.symbol})`}
                        value={currency.code}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>İşlem Tipi</Text>
                <View style={styles.typeSelector}>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      newTransaction.transactionType === 'Gelir' &&
                        styles.typeButtonActive,
                    ]}
                    onPress={() =>
                      setNewTransaction({
                        ...newTransaction,
                        transactionType: 'Gelir',
                        category: incomeCategories[0], // İlk kategoriyi varsayılan olarak seç
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        newTransaction.transactionType === 'Gelir' &&
                          styles.typeButtonTextActive,
                      ]}
                    >
                      Gelir
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      newTransaction.transactionType === 'Gider' &&
                        styles.typeButtonActive,
                    ]}
                    onPress={() =>
                      setNewTransaction({
                        ...newTransaction,
                        transactionType: 'Gider',
                        category: expenseCategories[0], // İlk kategoriyi varsayılan olarak seç
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        newTransaction.transactionType === 'Gider' &&
                          styles.typeButtonTextActive,
                      ]}
                    >
                      Gider
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Kategori</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={newTransaction.category}
                    onValueChange={(value) =>
                      setNewTransaction({ ...newTransaction, category: value })
                    }
                    style={styles.picker}
                  >
                    <Picker.Item label="Kategori seçin..." value="" />
                    {newTransaction.transactionType === 'Gelir' ? (
                      incomeCategories.map((category) => (
                        <Picker.Item
                          key={category}
                          label={category}
                          value={category}
                        />
                      ))
                    ) : (
                      expenseCategories.map((category) => (
                        <Picker.Item
                          key={category}
                          label={category}
                          value={category}
                        />
                      ))
                    )}
                  </Picker>
                </View>
              </View>

              {newTransaction.transactionType === 'Gider' && (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Ödeme Yöntemi</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={newTransaction.paymentType}
                      onValueChange={(value) =>
                        setNewTransaction({ ...newTransaction, paymentType: value })
                      }
                      style={styles.picker}
                    >
                      <Picker.Item label="Ödeme yöntemi seçin..." value="" />
                      
                      {/* Banka Kartları */}
                      {bankCards.map((card) => (
                        <Picker.Item
                          key={`bank_${card.id}`}
                          label={`Banka Kartı - ${card.cardName || card.name}`}
                          value={`BANK_${card.id}`}
                        />
                      ))}

                      {/* Kredi Kartları */}
                      {creditCards.map((card) => (
                        <Picker.Item
                          key={`credit_${card.id}`}
                          label={`Kredi Kartı - ${card.name}`}
                          value={`CREDIT_${card.id}`}
                        />
                      ))}

                      {/* Nakit */}
                      <Picker.Item
                        label="Nakit"
                        value="NAKIT"
                      />

                      {/* Havale/EFT */}
                      <Picker.Item
                        label="Havale/EFT"
                        value="HAVALE"
                      />
                    </Picker>
                  </View>
                </View>
              )}

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddTransactionLocal}
              >
                <Text style={styles.submitButtonText}>İşlemi Ekle</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};
export default RecentTransactionsScreen;