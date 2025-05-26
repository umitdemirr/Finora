import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Budget Screens
import AccountsScreen from '../screens/budget/AccountsScreen';
import AccountDetailScreen from '../screens/budget/AccountDetailScreen';
import AddAccountScreen from '../screens/budget/AddAccountScreen';
import CardsScreen from '../screens/budget/CardsScreen';
import AddCardScreen from '../screens/budget/AddCardScreen';
import AddCreditCardScreen from '../screens/budget/AddCreditCardScreen';
import HomeScreen from '../screens/budget/HomeScreen';
import BudgetAnalysisScreen from '../screens/budget/BudgetAnalysisScreen';

// AI Screen
import AiChatScreen from '../screens/ai/AiChatScreen';

// Portfolio Screen
import PortfolioScreen from '../screens/portfolio/PortfolioScreen';
import StockAccountsScreen from '../screens/portfolio/StockAccountsScreen';
import StockTransactionsScreen from '../screens/portfolio/StockTransactionsScreen';
import AddStockTransactionScreen from '../screens/portfolio/AddStockTransactionScreen';
import PortfolioAiAnalysisScreen from '../screens/portfolio/PortfolioAiAnalysisScreen';

// Bottom Tab Navigator Screeens
import TransactionsScreen from '../screens/transactions/RecentTransactionsScreen';
import PersonalInfoScreen from '../screens/setting/PersonalInfoScreen';
import SettingsScreen from '../screens/setting/SettingsScreen';

// About Screens
import PrivacyPolicyScreen from '../screens/about/PrivacyPolicyScreen';
import TermsScreen from '../screens/about/TermsScreen';
import AboutScreen from '../screens/about/AboutScreen';

// Import screens
import CreditCardDetailScreen from '../screens/cards/CreditCardDetailScreen';

// Create navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HeaderTitle = () => (
  <View style={styles.headerContainer}>
    <Icon name="wallet" size={28} color="#FFF" style={styles.headerIcon} />
    <Text style={styles.headerTitle}>Finora</Text>
  </View>
);

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 1,
  },
  headerGradient: {
    height: 60,
    width: '100%',
    justifyContent: 'center',
  },
});

// Bottom Tab Navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#FFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        header: () => (
          <LinearGradient
            colors={['#2196F3', '#1976D2']}
            style={styles.headerGradient}
          >
            <HeaderTitle />
          </LinearGradient>
        ),
        headerTitleAlign: 'center',
        headerLeft: () => null,
      }}
    >
      <Tab.Screen
        name="BudgetHome"
        component={HomeScreen}
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Accounts"
        component={AccountsScreen}
        options={{
          title: 'Hesaplarım',
          tabBarIcon: ({ color, size }) => (
            <Icon name="bank" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Cards"
        component={CardsScreen}
        options={{
          title: 'Kartlar',
          tabBarIcon: ({ color, size }) => (
            <Icon name="credit-card" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Portfolio"
        component={PortfolioScreen}
        options={{
          title: 'Yatırım',
          tabBarIcon: ({ color, size }) => (
            <Icon name="chart-line" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AiChat"
        component={AiChatScreen}
        options={{
          title: 'AI Asistan',
          tabBarIcon: ({ color, size }) => (
            <Icon name="robot" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Ayarlar',
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          header: () => (
            <LinearGradient
              colors={['#2196F3', '#1976D2']}
              style={styles.headerGradient}
            >
              <HeaderTitle />
            </LinearGradient>
          ),
          headerTitleAlign: 'center',
          headerLeft: () => null,
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Accounts"
          component={AccountsScreen}
          options={{ title: 'Hesaplarım' }}
        />
        <Stack.Screen
          name="Transactions"
          component={TransactionsScreen}
          options={{ title: 'Son İşlemler' }}
        />
        <Stack.Screen
          name="AccountDetail"
          component={AccountDetailScreen}
          options={{ title: 'Hesap Detayı' }}
        />
        <Stack.Screen
          name="Cards"
          component={CardsScreen}
          options={{ title: 'Kartlarım' }}
        />
        <Stack.Screen
          name="AddCard"
          component={AddCardScreen}
          options={{ title: 'Banka Kart Ekle' }}
        />
        <Stack.Screen
          name="AddCreditCard"
          component={AddCreditCardScreen}
          options={{ title: 'Kredi Kartı Ekle' }}
        />
        <Stack.Screen
          name="CardDetail"
          component={CreditCardDetailScreen}
          options={{ title: 'Kredi Kartı Detayı' }}
        />
        <Stack.Screen
          name="PersonalInfo"
          component={PersonalInfoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddAccount"
          component={AddAccountScreen}
          options={{ title: 'Yeni Hesap Ekle' }}
        />
        <Stack.Screen
          name="AiChat"
          component={AiChatScreen}
          options={{ title: 'AI Asistan' }}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicyScreen}
          options={{ title: 'Gizlilik Politikası' }}
        />
        <Stack.Screen
          name="Terms"
          component={TermsScreen}
          options={{ title: 'Kullanım Koşulları' }}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{ title: 'Uygulama Hakkında' }}
        />
        <Stack.Screen
          name="StockAccounts"
          component={StockAccountsScreen}
          options={{ title: 'Hisse Senetleri' }}
        />
        <Stack.Screen
          name="StockTransactions"
          component={StockTransactionsScreen}
          options={{ title: 'İşlem Geçmişi' }}
        />
        <Stack.Screen
          name="AddStockTransaction"
          component={AddStockTransactionScreen}
          options={{ title: 'Yeni İşlem Ekle' }}
        />
        <Stack.Screen
          name="BudgetAnalysis"
          component={BudgetAnalysisScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PortfolioAiAnalysis"
          component={PortfolioAiAnalysisScreen}
          options={{ title: 'AI Portföy Analizi' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;