import { StyleSheet } from 'react-native';
import { colors, shadows } from './globalStyles';

export const CardsStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f7fafc',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f7fafc',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      backgroundColor: colors.white,
      borderBottomWidth: 1,
      borderBottomColor: '#e2e8f0',
      ...shadows.premium.header,
    },
    title: {
      fontSize: 26,
      fontWeight: '700',
      color: '#2d3748',
    },
    addButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#f7fafc',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#e2e8f0',
    },
    section: {
      marginBottom: 20,
      marginTop: 10,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: '#2d3748',
      marginHorizontal: 20,
      marginBottom: 15,
      marginTop: 10,
    },
    cardsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      marginTop: 60,
    },
    emptyText: {
      fontSize: 18,
      color: '#718096',
      marginTop: 20,
      textAlign: 'center',
    },
  
    // Ortak Kart Stilleri
    cardContainer: {
      backgroundColor: colors.white,
      borderRadius: 16,
      marginBottom: 16,
      padding: 20,
      width: '48%',
      ...shadows.premium.card,
      borderWidth: 1,
      borderColor: '#f1f5f9',
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 18,
    },
    bankInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    bankName: {
      fontSize: 15,
      color: '#718096',
      marginLeft: 10,
      fontWeight: '500',
    },
    cardBody: {
      marginBottom: 10,
    },
    cardName: {
      fontSize: 19,
      fontWeight: '700',
      color: '#2d3748',
      marginBottom: 6,
    },
    cardNumber: {
      fontSize: 22,
      fontWeight: '600',
      letterSpacing: 2.5,
      marginBottom: 20,
      color: '#4a5568',
    },
    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    cardInfo: {
      flex: 1,
    },
    cardInfoLabel: {
      fontSize: 12,
      color: '#a0aec0',
      marginBottom: 6,
    },
    cardInfoValue: {
      fontSize: 15,
      fontWeight: '600',
      color: '#2d3748',
    },
  
    // Modal Stilleri
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.white,
      borderRadius: 25,
      padding: 25,
      width: '85%',
      maxWidth: 450,
      ...shadows.premium.modal,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 25,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: '#2d3748',
    },
    closeButton: {
      padding: 8,
    },
    modalOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 18,
      borderBottomWidth: 1,
      borderBottomColor: '#f1f5f9',
    },
    modalOptionText: {
      fontSize: 17,
      color: '#2d3748',
      marginLeft: 18,
      fontWeight: '500',
    },
  
    // Banka Kartı Stilleri
    bankCardContainer: {
      backgroundColor: colors.white,
      borderRadius: 16,
      marginBottom: 16,
      padding: 20,
      width: '48%',
      ...shadows.premium.card,
      borderWidth: 1,
      borderColor: '#f1f5f9',
    },
    bankCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 18,
    },
    bankCardBody: {
      marginBottom: 10,
    },
    bankCardName: {
      fontSize: 18,
      fontWeight: '600',
      color: '#2d3748',
      marginBottom: 6,
    },
    bankCardNumber: {
      fontSize: 20,
      fontWeight: '500',
      letterSpacing: 2,
      marginBottom: 20,
      color: '#4a5568',
    },
    bankCardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    bankCardInfo: {
      flex: 1,
    },
    bankCardInfoLabel: {
      fontSize: 12,
      color: '#a0aec0',
      marginBottom: 4,
    },
    bankCardInfoValue: {
      fontSize: 14,
      fontWeight: '500',
      color: '#2d3748',
    },
  
    // Kredi Kartı Stilleri
    creditCardContainer: {
      backgroundColor: '#2d3748',
      borderRadius: 16,
      marginBottom: 16,
      padding: 20,
      width: '48%',
      ...shadows.premium.card,
    },
    creditCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 18,
    },
    creditCardBody: {
      marginBottom: 10,
    },
    creditCardName: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.white,
      marginBottom: 6,
    },
    creditCardNumber: {
      fontSize: 20,
      fontWeight: '500',
      letterSpacing: 2,
      marginBottom: 20,
      color: colors.white,
    },
    creditCardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    creditCardInfo: {
      flex: 1,
    },
    creditCardInfoLabel: {
      fontSize: 12,
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: 4,
    },
    creditCardInfoValue: {
      fontSize: 14,
      fontWeight: '500',
      color: '#FFFFFF',
    },
  });