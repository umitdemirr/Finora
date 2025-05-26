import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AboutScreen = () => {
  const handleContact = () => {
    Linking.openURL('mailto:support@fino.com');
  };

  const handleWebsite = () => {
    Linking.openURL('https://www.fino.com');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2196F3', '#1976D2']}
        style={styles.header}
      >
        <Icon name="wallet" size={64} color="#fff" style={styles.headerIcon} />
        <Text style={styles.appName}>Fino</Text>
        <Text style={styles.version}>Versiyon 1.0.0</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Uygulama Hakkında</Text>
          <Text style={styles.text}>
            Fino, finansal işlemlerinizi kolayca yönetmenizi sağlayan modern bir mobil uygulamadır. 
            Güvenli, kullanıcı dostu ve yenilikçi özellikleriyle finansal hayatınızı kolaylaştırır.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Özellikler</Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Icon name="shield-check" size={24} color="#2196F3" />
              <Text style={styles.featureText}>Güvenli İşlemler</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="chart-line" size={24} color="#2196F3" />
              <Text style={styles.featureText}>Detaylı Raporlar</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="bell-ring" size={24} color="#2196F3" />
              <Text style={styles.featureText}>Anlık Bildirimler</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>İletişim</Text>
          <TouchableOpacity style={styles.contactButton} onPress={handleContact}>
            <Icon name="email" size={24} color="#2196F3" />
            <Text style={styles.contactText}>Bize Ulaşın</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactButton} onPress={handleWebsite}>
            <Icon name="web" size={24} color="#2196F3" />
            <Text style={styles.contactText}>Web Sitemiz</Text>
          </TouchableOpacity>
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
    paddingBottom: 30,
    alignItems: 'center',
  },
  headerIcon: {
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  version: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  featureList: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  contactText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
});

export default AboutScreen; 