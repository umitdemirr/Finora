import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const PrivacyPolicyScreen = () => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2196F3', '#1976D2']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Gizlilik Politikası</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Veri Toplama</Text>
          <Text style={styles.text}>
            Uygulamamız, size daha iyi hizmet sunabilmek için bazı kişisel verilerinizi toplamaktadır. 
            Bu veriler arasında ad, soyad, e-posta adresi ve profil bilgileriniz bulunmaktadır.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Veri Kullanımı</Text>
          <Text style={styles.text}>
            Toplanan verileriniz, hizmetlerimizi iyileştirmek, size özel içerik sunmak ve 
            güvenliğinizi sağlamak amacıyla kullanılmaktadır.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Veri Güvenliği</Text>
          <Text style={styles.text}>
            Verilerinizin güvenliği bizim için önemlidir. Bu nedenle, verilerinizi korumak için 
            endüstri standardı güvenlik önlemleri kullanmaktayız.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Veri Paylaşımı</Text>
          <Text style={styles.text}>
            Kişisel verileriniz, yasal zorunluluklar dışında üçüncü taraflarla paylaşılmamaktadır.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});

export default PrivacyPolicyScreen; 