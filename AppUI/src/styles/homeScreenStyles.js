import { StyleSheet } from 'react-native';

// Local colors for HomeScreen
const colors = {
  primary: '#2196F3',
  secondary: '#1a365d',
  background: '#F5F5F5',
  white: '#fff',
  error: '#d32f2f',
  success: '#4CAF50',
  border: '#e1e8f0',
  text: {
    primary: '#1a365d',
    secondary: '#4a5568',
    placeholder: '#999',
    disabled: '#ccc',
    light: '#666',
  },
  premium: {
    headerGradient: ['#1a1a2e', '#16213e'],
    mainCardGradient: ['#2d3748', '#4a5568'],
    incomeCardGradient: ['#2d3748', '#4a5568'],
    expenseCardGradient: ['#2d3748', '#4a5568'],
    positiveNetGradient: ['#2f855a', '#38a169'],
    negativeNetGradient: ['#e53e3e', '#f56565'],
    incomeIconGradient: ['#2f855a', '#38a169'],
    expenseIconGradient: ['#e53e3e', '#f56565'],
    filterActive: '#4a5568',
    chartBackground: '#f7fafc',
  }
};

// Local shadows for HomeScreen
const shadows = {
  small: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  medium: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  large: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  premium: {
    header: {
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
    },
    card: {
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
    },
    graph: {
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
    },
  },
};

export const HomeStyles = StyleSheet.create({
    container: { 
      flex: 1, 
      backgroundColor: '#f7fafc' 
    },
    loadingContainer: { 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center' 
    },
    
    // Premium Header Styles
    headerGradient: {
      paddingTop: 60,
      paddingBottom: 30,
      paddingHorizontal: 24,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      ...shadows.premium.header,
    },
    pageTitle: { 
      fontSize: 28, 
      fontWeight: 'bold', 
      color: colors.white, 
      marginBottom: 4,
    },
    pageSubtitle: { 
      fontSize: 16, 
      color: 'rgba(255,255,255,0.8)',
    },
    
    // Container Styles
    scrollContainer: { 
      flex: 1,
      paddingTop: 40,
    },
    
    // Premium Card Styles
    cardsContainer: { 
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    premiumCard: {
      borderRadius: 20,
      padding: 24,
      marginBottom: 16,
      ...shadows.premium.card,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    mainCard: {
      marginBottom: 20,
      alignSelf: 'stretch',
    },
    cardContent: { 
      flex: 1,
      alignItems: 'stretch',
    },
    cardHeader: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: 12,
    },
    mainCardLabel: { 
      color: 'rgba(255,255,255,0.9)', 
      fontSize: 18,
      fontWeight: '600',
      letterSpacing: 0.3,
    },
    mainCardValue: { 
      color: colors.white, 
      fontSize: 36, 
      fontWeight: '800', 
      marginBottom: 8,
      textAlign: 'left',
      letterSpacing: 0.5,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    mainCardSubtext: { 
      color: 'rgba(255,255,255,0.8)', 
      fontSize: 15,
      fontWeight: '500',
    },
    
    // Small Cards
    smallCardsRow: { 
      flexDirection: 'row', 
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    smallCard: {
      flex: 1,
      marginHorizontal: 6,
    },
    smallCardContent: { 
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 120,
    },
    smallCardValue: { 
      color: colors.white, 
      fontSize: 20, 
      fontWeight: '700', 
      marginTop: 8,
      marginBottom: 4,
      textAlign: 'center',
      letterSpacing: 0.3,
      textShadowColor: 'rgba(0, 0, 0, 0.2)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    smallCardLabel: { 
      color: 'rgba(255,255,255,0.9)', 
      fontSize: 14,
      textAlign: 'center',
      fontWeight: '500',
    },
    
    // Net Card
    netCard: {
      marginBottom: 0,
      alignSelf: 'stretch',
    },
    netCardLabel: { 
      color: 'rgba(255,255,255,0.9)', 
      fontSize: 18,
      fontWeight: '600',
      letterSpacing: 0.3,
    },
    netCardValue: { 
      color: colors.white, 
      fontSize: 32, 
      fontWeight: '800', 
      marginBottom: 8,
      textAlign: 'left',
      letterSpacing: 0.5,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    netCardSubtext: { 
      color: 'rgba(255,255,255,0.8)', 
      fontSize: 15,
      fontWeight: '500',
    },
    
    // AI Budget Analysis Button
    analysisButton: {
      marginTop: 16,
      borderRadius: 16,
      overflow: 'hidden',
      ...shadows.premium.card,
    },
    analysisButtonGradient: {
      borderRadius: 16,
      padding: 20,
    },
    analysisButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    analysisButtonLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    analysisButtonText: {
      marginLeft: 16,
      flex: 1,
    },
    analysisButtonTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#fff',
      marginBottom: 4,
      letterSpacing: 0.3,
    },
    analysisButtonSubtitle: {
      fontSize: 14,
      color: 'rgba(255,255,255,0.8)',
      fontWeight: '500',
    },
    
    // Chart Section
    chartSection: { 
      paddingHorizontal: 20,
    },
    premiumGraphCard: {
      backgroundColor: colors.white,
      borderRadius: 20,
      padding: 28,
      marginBottom: 20,
      ...shadows.premium.graph,
      borderWidth: 1,
      borderColor: '#f1f5f9',
    },
    graphHeader: { 
      marginBottom: 20,
    },
    graphTitle: { 
      fontSize: 22, 
      fontWeight: '700', 
      color: '#1E293B', 
      marginBottom: 6,
      letterSpacing: 0.3,
    },
    graphSubtitle: { 
      color: '#64748B', 
      fontSize: 15,
      marginBottom: 20,
      fontWeight: '500',
    },
    
    // Filter Styles
    filterContainer: { 
      marginTop: 16,
    },
    filtersScroll: { 
      marginBottom: 12,
    },
    premiumFilterButton: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 16,
      backgroundColor: '#f7fafc',
      marginRight: 12,
      borderWidth: 1,
      borderColor: '#e2e8f0',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    premiumFilterButtonActive: {
      backgroundColor: '#3B82F6',
      borderColor: '#3B82F6',
      shadowColor: '#3B82F6',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    premiumFilterButtonText: {
      color: '#64748B',
      fontSize: 14,
      fontWeight: '600',
    },
    premiumFilterButtonTextActive: {
      color: colors.white,
      fontWeight: '700',
    },
    
    // Chart View Options
    chartViewOptions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    premiumViewButton: {
      padding: 12,
      borderRadius: 12,
      marginLeft: 8,
      backgroundColor: '#f7fafc',
      borderWidth: 1,
      borderColor: '#e2e8f0',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    premiumViewButtonActive: {
      backgroundColor: '#3B82F6',
      borderColor: '#3B82F6',
      shadowColor: '#3B82F6',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    
    // Chart Container
    chartContainer: {
      alignItems: 'center',
      marginVertical: 16,
      backgroundColor: '#f8fafc',
      borderRadius: 16,
      padding: 12,
    },
    chart: {
      borderRadius: 16,
    },
    
    // Premium Transactions
    premiumTransactionsContainer: {
      backgroundColor: colors.white,
      borderRadius: 20,
      padding: 28,
      margin: 20,
      marginTop: 0,
      ...shadows.premium.graph,
      borderWidth: 1,
      borderColor: '#f1f5f9',
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: '#1E293B',
      marginBottom: 6,
      letterSpacing: 0.3,
    },
    sectionSubtitle: {
      color: '#64748B',
      fontSize: 15,
      fontWeight: '500',
    },
    premiumViewAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 12,
      backgroundColor: '#f7fafc',
      borderWidth: 1,
      borderColor: '#e2e8f0',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    viewAllText: {
      color: '#3B82F6',
      marginRight: 4,
      fontWeight: '600',
    },
    
    // Transaction Items
    premiumTransactionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 18,
      borderBottomWidth: 1,
      borderBottomColor: '#f1f5f9',
      borderRadius: 12,
      marginBottom: 4,
      paddingHorizontal: 4,
    },
    transactionIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginRight: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    transactionIconGradient: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    transactionInfo: {
      flex: 1,
    },
    premiumTransactionDescription: {
      fontSize: 16,
      color: '#2d3748',
      fontWeight: '500',
      marginBottom: 4,
    },
    premiumTransactionDate: {
      fontSize: 14,
      color: '#718096',
    },
    premiumTransactionAmount: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    
    // No Transactions
    noTransactionsContainer: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    noTransactionsText: {
      color: '#718096',
      fontSize: 16,
      fontWeight: '500',
      marginTop: 12,
      marginBottom: 4,
    },
    noTransactionsSubtext: {
      color: '#a0aec0',
      fontSize: 14,
    },
  });

export { colors };