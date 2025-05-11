import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Screens
import HomeScreen from '../screens/HomeScreen';
import IncomeScreen from '../screens/transactions/IncomeScreen';
import ExpenseScreen from '../screens/transactions/ExpenseScreen';
import RecentTransactionsScreen from '../screens/transactions/RecentTransactionsScreen';
import PortfolioScreen from '../screens/investment/PortfolioScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          height: 60,
          paddingBottom: 5,
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Ana Sayfa',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Income"
        component={IncomeScreen}
        options={{
          tabBarLabel: 'Gelirler',
          tabBarIcon: ({ color, size }) => (
            <Icon name="cash-plus" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Expense"
        component={ExpenseScreen}
        options={{
          tabBarLabel: 'Giderler',
          tabBarIcon: ({ color, size }) => (
            <Icon name="cash-minus" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={RecentTransactionsScreen}
        options={{
          tabBarLabel: 'İşlemler',
          tabBarIcon: ({ color, size }) => (
            <Icon name="clock-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Portfolio"
        component={PortfolioScreen}
        options={{
          tabBarLabel: 'Yatırım',
          tabBarIcon: ({ color, size }) => (
            <Icon name="chart-line" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator; 