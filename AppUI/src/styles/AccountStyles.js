import { StyleSheet } from 'react-native';

// Enhanced colors for Accounts
const colors = {
  primary: '#2563EB',
  secondary: '#1E40AF',
  backgroundSolid: '#F8FAFC',
  white: '#FFFFFF',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  border: '#E2E8F0',
  text: {
    primary: '#1E293B',
    secondary: '#64748B',
    placeholder: '#94A3B8',
    disabled: '#CBD5E1',
    light: '#64748B',
  },
  account: {
    primary: '#2563EB',
    secondary: '#1E40AF',
    background: '#F8FAFC',
    border: '#E2E8F0',
    cardBackground: '#FFFFFF',
    gradient: ['#2563EB', '#1E40AF'],
    accent: '#3B82F6',
    glow: 'rgba(37, 99, 235, 0.3)',
  }
};

// Enhanced shadows for Accounts
const shadows = {
  small: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  medium: {
    elevation: 6,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  large: {
    elevation: 12,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  premium: {
    elevation: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  glow: {
    elevation: 20,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
  },
};

export const AccountStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSolid,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingTop: 20,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.account.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.premium,
    marginLeft: 16,
  },
  addButtonIcon: {
    color: colors.white,
  },
  
  // Bank Section
  bankSection: {
    marginBottom: 32,
  },
  bankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    ...shadows.medium,
  },
  bankIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.account.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: colors.account.border,
  },
  bankTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    letterSpacing: 0.2,
  },
  bankAccountCount: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
    marginTop: 2,
  },
  
  // Accounts Grid
  accountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  accountContainer: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    ...shadows.premium,
    borderWidth: 1,
    borderColor: colors.account.border,
    position: 'relative',
    overflow: 'hidden',
  },
  accountGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.account.primary,
    opacity: 0.8,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  accountTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.account.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.account.border,
  },
  currencyContainer: {
    backgroundColor: colors.account.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.account.border,
  },
  currencyText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  
  // Account Body
  accountBody: {
    marginTop: 8,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  balance: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.account.primary,
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  balanceLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  
  // IBAN Section
  ibanContainer: {
    backgroundColor: colors.account.background,
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.account.border,
  },
  ibanLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  ibanValue: {
    fontSize: 13,
    color: colors.text.primary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  
  // Performance Indicator
  performanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: colors.account.background,
    borderRadius: 8,
    padding: 8,
  },
  performanceIcon: {
    marginRight: 6,
  },
  performanceText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
  },
  
  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
    backgroundColor: colors.white,
    borderRadius: 24,
    marginTop: 40,
    borderWidth: 2,
    borderColor: colors.account.border,
    borderStyle: 'dashed',
    ...shadows.medium,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.account.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.account.border,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: '85%',
    fontWeight: '500',
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.account.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 20,
    ...shadows.medium,
  },
  emptyButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSolid,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  
  // Summary Cards
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 6,
    alignItems: 'center',
    ...shadows.premium,
    borderWidth: 1,
    borderColor: colors.account.border,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.account.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.account.border,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
  },
  
  // Quick Actions
  quickActionsContainer: {
    marginBottom: 32,
  },
  quickActionsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    ...shadows.medium,
    borderWidth: 1,
    borderColor: colors.account.border,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.account.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.account.border,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
  
  // Animation states
  accountPressed: {
    transform: [{ scale: 0.98 }],
  },
  
  // Enhanced visual effects
  glowEffect: {
    shadowColor: colors.account.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
});

export { colors }; 