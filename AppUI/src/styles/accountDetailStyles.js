import { StyleSheet } from 'react-native';

// Enhanced colors for Account Detail
const colors = {
  primary: '#059669',
  secondary: '#047857',
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
    primary: '#059669',
    secondary: '#047857',
    background: '#F8FAFC',
    border: '#E2E8F0',
    cardBackground: '#FFFFFF',
    gradient: ['#059669', '#047857'],
    accent: '#10B981',
    glow: 'rgba(5, 150, 105, 0.3)',
    income: '#10B981',
    expense: '#EF4444',
    debt: '#F59E0B',
  }
};

// Enhanced shadows for Account Detail
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
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  large: {
    elevation: 12,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  premium: {
    elevation: 16,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  glow: {
    elevation: 20,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
  },
};

export const AccountDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSolid,
  },
  scrollView: {
    flex: 1,
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
  
  // Account Header
  accountHeader: {
    backgroundColor: colors.account.primary,
    padding: 24,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
    overflow: 'hidden',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  accountInfo: {
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  accountIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  accountName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  bankName: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  balance: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
    marginTop: 16,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
  
  // Summary Container
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: -30,
    marginBottom: 24,
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
    position: 'relative',
    overflow: 'hidden',
  },
  summaryCardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    opacity: 0.8,
  },
  incomeCardGlow: {
    backgroundColor: colors.account.income,
  },
  expenseCardGlow: {
    backgroundColor: colors.account.expense,
  },
  balanceCardGlow: {
    backgroundColor: colors.account.primary,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
  },
  incomeIcon: {
    backgroundColor: '#ECFDF5',
    borderColor: '#BBF7D0',
  },
  expenseIcon: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  balanceIcon: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  incomeText: {
    color: colors.account.income,
  },
  expenseText: {
    color: colors.account.expense,
  },
  balanceText: {
    color: colors.account.primary,
  },
  
  // Transactions Container
  transactionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 20,
    letterSpacing: 0.2,
  },
  
  // Transaction Sections
  transactionSection: {
    marginBottom: 32,
  },
  transactionSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 16,
    paddingHorizontal: 8,
    letterSpacing: 0.2,
  },
  
  // Transaction Items
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 20,
    marginBottom: 12,
    ...shadows.premium,
    borderWidth: 1,
    borderColor: colors.account.border,
    position: 'relative',
    overflow: 'hidden',
  },
  transactionGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    opacity: 0.8,
  },
  incomeItem: {
    borderLeftWidth: 4,
    borderLeftColor: colors.account.income,
  },
  expenseItem: {
    borderLeftWidth: 4,
    borderLeftColor: colors.account.expense,
  },
  debtItem: {
    borderLeftWidth: 4,
    borderLeftColor: colors.account.debt,
  },
  
  // Transaction Content
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
  },
  incomeIcon: {
    backgroundColor: '#ECFDF5',
    borderColor: '#BBF7D0',
  },
  expenseIcon: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  debtIcon: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  transactionDate: {
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: 2,
    fontWeight: '500',
  },
  transactionType: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  incomeType: {
    backgroundColor: '#ECFDF5',
    color: colors.account.income,
  },
  expenseType: {
    backgroundColor: '#FEF2F2',
    color: colors.account.expense,
  },
  debtType: {
    backgroundColor: '#FFFBEB',
    color: colors.account.debt,
  },
  
  // Transaction Amount
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  incomeAmount: {
    color: colors.account.income,
  },
  expenseAmount: {
    color: colors.account.expense,
  },
  debtAmount: {
    color: colors.account.debt,
  },
  
  // Add Button
  addButton: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.account.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.glow,
  },
  addButtonIcon: {
    color: colors.white,
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '85%',
    ...shadows.premium,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.account.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: 0.2,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.account.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.account.border,
  },
  modalBody: {
    maxHeight: '100%',
  },
  
  // Form Styles
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: colors.account.background,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 2,
    borderColor: colors.account.border,
    fontWeight: '600',
  },
  inputFocused: {
    borderColor: colors.account.primary,
    backgroundColor: colors.white,
  },
  
  // Type Selector
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: colors.account.background,
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.account.border,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  typeButtonActive: {
    backgroundColor: colors.account.primary,
    ...shadows.medium,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  typeButtonTextActive: {
    color: colors.white,
  },
  
  // Submit Button
  submitButton: {
    backgroundColor: colors.account.primary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    ...shadows.premium,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  
  // Picker Container
  pickerContainer: {
    backgroundColor: colors.account.background,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.account.border,
    overflow: 'hidden',
  },
  picker: {
    height: 56,
    width: '100%',
  },
  
  // Type Label
  typeLabel: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  typeLabelText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
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
  
  // Cards Section
  cardsSection: {
    marginBottom: 32,
  },
  cardsSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  cardItem: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...shadows.medium,
    borderWidth: 1,
    borderColor: colors.account.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.account.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: colors.account.border,
  },
  cardInfo: {
    flex: 1,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  cardType: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  
  // Animation states
  transactionPressed: {
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