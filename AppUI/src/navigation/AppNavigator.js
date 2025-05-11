import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import CardsScreen from '../screens/CardsScreen';
import TransfersScreen from '../screens/TransfersScreen';
import PaymentsScreen from '../screens/PaymentsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AssetDetailScreen from '../screens/investment/AssetDetailScreen';
import TradeScreen from '../screens/investment/TradeScreen';
import AnalysisScreen from '../screens/investment/AnalysisScreen';
import PortfolioScreen from '../screens/investment/PortfolioScreen';

// Import screens
import BudgetHomeScreen from '../screens/BudgetHomeScreen';
import AccountsScreen from '../screens/AccountsScreen';
import IncomeScreen from '../screens/IncomeScreen';
import ExpenseScreen from '../screens/ExpenseScreen';
import BillsScreen from '../screens/BillsScreen';
import SavingsScreen from '../screens/SavingsScreen';
import AccountDetailScreen from '../screens/AccountDetailScreen';
import CardDetailScreen from '../screens/CardDetailScreen';


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
        component={BudgetHomeScreen}
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Expenses"
        component={ExpenseScreen}
        options={{
          title: 'Giderler',
          tabBarIcon: ({ color, size }) => (
            <Icon name="cash-minus" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Income"
        component={IncomeScreen}
        options={{
          title: 'Gelirler',
          tabBarIcon: ({ color, size }) => (
            <Icon name="cash-plus" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Savings"
        component={SavingsScreen}
        options={{
          title: 'Birikimler',
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
          name="Cards"
          component={CardsScreen}
          options={{ title: 'Kartlarım' }}
        />
        <Stack.Screen
          name="Transfers"
          component={TransfersScreen}
          options={{ title: 'Transferler' }}
        />
        <Stack.Screen
          name="Payments"
          component={PaymentsScreen}
          options={{ title: 'Ödemeler' }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Profil' }}
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
          name="AccountDetail"
          component={AccountDetailScreen}
          options={{ title: 'Hesap Detayı' }}
        />
        <Stack.Screen
          name="CardDetail"
          component={CardDetailScreen}
          options={{ title: 'Kart Detayı' }}
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