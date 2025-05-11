import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileScreen = () => {
  const profileOptions = [
    {
      id: 'personal',
      title: 'Kişisel Bilgiler',
      icon: 'account',
    },
    {
      id: 'security',
      title: 'Güvenlik Ayarları',
      icon: 'shield-lock',
    },
    {
      id: 'notifications',
      title: 'Bildirim Ayarları',
      icon: 'bell',
    },
    {
      id: 'preferences',
      title: 'Tercihler',
      icon: 'cog',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.profileImage}
          source={{ uri: 'https://via.placeholder.com/100' }}
        />
        <Text style={styles.name}>Ümit Demir</Text>
        <Text style={styles.email}>umit@example.com</Text>
      </View>

      <View style={styles.optionsContainer}>
        {profileOptions.map((option) => (
          <TouchableOpacity key={option.id} style={styles.option}>
            <View style={styles.optionLeft}>
              <Icon name={option.icon} size={24} color="#007AFF" />
              <Text style={styles.optionTitle}>{option.title}</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <Icon name="logout" size={24} color="#FF3B30" />
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  optionsContainer: {
    backgroundColor: '#ffffff',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    marginTop: 20,
    padding: 16,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF3B30',
    marginLeft: 8,
  },
});

export default ProfileScreen; 