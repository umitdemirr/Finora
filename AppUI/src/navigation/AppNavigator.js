import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
import BudgetHomeScreen from '../screens/budget/BudgetHomeScreen';



// Investment Screens
import AssetDetailScreen from '../screens/investment/AssetDetailScreen';
import TradeScreen from '../screens/investment/TradeScreen';
import AnalysisScreen from '../screens/investment/AnalysisScreen';
import PortfolioScreen from '../screens/investment/PortfolioScreen';

// Bottom Tab Navigator Screeens
import HomeScreen from '../screens/HomeScreen';
import TransactionsScreen from '../screens/transactions/RecentTransactionsScreen';
import ProfileScreen from '../screens/ProfileScreen';


// Import screens
import BillsScreen from '../screens/BillsScreen';


// Create navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
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
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#FFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="BudgetHome"
        component={BudgetHomeScreen}
        options={{
          title: 'Bütçe Yönetimi',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          title: 'Son İşlemler',
          tabBarIcon: ({ color, size }) => (
            <Icon name="piggy-bank" size={size} color={color} />
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
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Icon name="chart-line" size={size} color={color} />
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
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#FFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
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
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Profil' }}
        />
        <Stack.Screen
          name="AddAccount"
          component={AddAccountScreen}
          options={{ title: 'Yeni Hesap Ekle' }}
        />
        <Stack.Screen
          name="AssetDetail"
          component={AssetDetailScreen}
          options={({ route }) => ({
            title: route.params.asset.symbol,
            headerStyle: {
              backgroundColor: '#2196F3',
            },
            headerTintColor: '#fff',
          })}
        />
        <Stack.Screen
          name="Trade"
          component={TradeScreen}
          options={({ route }) => ({
            title: route.params.type === 'buy' ? 'Alış Emri' : 'Satış Emri',
            headerStyle: {
              backgroundColor: '#2196F3',
            },
            headerTintColor: '#fff',
          })}
        />
        <Stack.Screen
          name="Analysis"
          component={AnalysisScreen}
          options={{
            title: 'Performans Analizi',
            headerStyle: {
              backgroundColor: '#2196F3',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="Bills"
          component={BillsScreen}
          options={{ title: 'Faturalar' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 