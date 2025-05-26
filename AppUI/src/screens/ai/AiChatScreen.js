import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
  Keyboard,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { aiChatStyles as styles, colors } from '../../styles/globalStyles';

const { width } = Dimensions.get('window');
const STORAGE_KEY = '@fino_ai_messages';

const MessageTypes = {
  USER: 'user',
  AI: 'ai',
  ERROR: 'error',
};

const AiChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    loadMessages();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadMessages = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } catch (error) {
      console.error('Mesajlar yüklenemedi:', error);
    }
  };

  const saveMessages = async (newMessages) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages));
    } catch (error) {
      console.error('Mesajlar kaydedilemedi:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage = {
      type: MessageTypes.USER,
      content: inputText.trim(),
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setLoading(true);
    Keyboard.dismiss();

    try {
      const { data } = await api.post('/Ai/simple-prompt', {
        model: 'gemini-2.0-flash',
        apiKey: 'AIzaSyBTRhZOPny-JCtWt9I0jVNBvSHfEBLsKIg',
        prompt: userMessage.content,
        answer: ''
      });

      if (!data?.answer) throw new Error('AI yanıt vermedi');

      const aiMessage = {
        type: MessageTypes.AI,
        content: data.answer,
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...newMessages, aiMessage];
      setMessages(updatedMessages);
      saveMessages(updatedMessages);
    } catch (error) {
      console.error('AI Error:', error);
      
      const errorMessage = {
        type: MessageTypes.ERROR,
        content: 'Üzgünüm, şu anda yanıt veremiyorum. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.',
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...newMessages, errorMessage];
      setMessages(updatedMessages);
      saveMessages(updatedMessages);
    } finally {
      setLoading(false);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  };

  const clearChat = async () => {
    Alert.alert(
      'Sohbeti Temizle',
      'Tüm sohbet geçmişi silinecek. Emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Temizle',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem(STORAGE_KEY);
            setMessages([]);
          }
        }
      ]
    );
  };

  const renderMessage = ({ type, content, timestamp }, index) => (
    <View
      key={index}
      style={[
        styles.messageContainer,
        styles[`${type}Message`]
      ]}
    >
      {type === MessageTypes.AI && (
        <View style={styles.avatarContainer}>
          <Icon 
            name="robot"
            size={20} 
            color="#2196F3"
          />
          <Text style={styles.assistantName}>FinorAI</Text>
        </View>
      )}
      <View style={[
        styles.messageBubble,
        styles[`${type}Bubble`]
      ]}>
        <Text style={[
          styles.messageText,
          styles[`${type}MessageText`]
        ]}>
          {content}
        </Text>
        {timestamp && (
          <Text style={styles.timestamp}>
            {new Date(timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        )}
      </View>
    </View>
  );

  const renderWelcome = () => (
    <Animated.View 
      style={[
        styles.welcomeContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <View style={styles.logoContainer}>
        <Icon name="robot" size={80} color="#2196F3" style={styles.welcomeIcon} />
        <View style={styles.logoGlow} />
        <View style={styles.logoRing} />
      </View>
      <Text style={styles.welcomeTitle}>FinorAI</Text>
      <Text style={styles.welcomeSubtitle}>Akıllı Finans Asistanınız</Text>
      <Text style={styles.welcomeText}>
        Merhaba! Ben FinorAI, finansal asistanınız. Size bütçe yönetimi, tasarruf ve yatırım konularında yardımcı olmak için buradayım.
      </Text>
    </Animated.View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Icon name="robot" size={24} color="#2196F3" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>FinorAI Asistan</Text>
        </View>
        {messages.length > 0 && (
          <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
            <Icon name="delete-outline" size={24} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.length === 0 ? renderWelcome() : messages.map(renderMessage)}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#2196F3" />
            <Text style={styles.loadingText}>FinorAI düşünüyor...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="FinorAI'ya bir soru sorun..."
          placeholderTextColor="#999"
          multiline
          maxLength={500}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity 
          style={[
            styles.sendButton,
            (!inputText.trim() || loading) && styles.sendButtonDisabled
          ]} 
          onPress={sendMessage}
          disabled={!inputText.trim() || loading}
        >
          <Icon 
            name="send" 
            size={24} 
            color={!inputText.trim() || loading ? '#ccc' : '#fff'} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AiChatScreen; 