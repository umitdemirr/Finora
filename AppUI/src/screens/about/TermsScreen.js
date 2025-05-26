import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const TermsScreen = () => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2196F3', '#1976D2']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Kullanım Koşulları</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Genel Hükümler</Text>
          <Text style={styles.text}>
            Bu uygulamayı kullanarak, aşağıdaki kullanım koşullarını kabul etmiş sayılırsınız. 
            Bu koşulları kabul etmiyorsanız, lütfen uygulamayı kullanmayınız.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Hesap Güvenliği</Text>
          <Text style={styles.text}>
            Hesabınızın güvenliğinden siz sorumlusunuz. Şifrenizi güvenli tutun ve 
            başkalarıyla paylaşmayın.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Kullanım Kuralları</Text>
          <Text style={styles.text}>
            Uygulamayı kullanırken yasalara ve etik kurallara uygun davranmalısınız. 
            Başkalarının haklarına saygı göstermelisiniz.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Hizmet Değişiklikleri</Text>
          <Text style={styles.text}>
            Uygulama özellikleri ve hizmetleri önceden haber vermeksizin değiştirilebilir 
            veya sonlandırılabilir.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Sorumluluk Reddi</Text>
          <Text style={styles.text}>
            Uygulama "olduğu gibi" sunulmaktadır ve herhangi bir garanti verilmemektedir.
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

export default TermsScreen; 