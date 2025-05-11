import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://26v20qzz-44324.euw.devtunnels.ms/api';

// Axios instance oluşturma
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15 saniye timeout
  headers: {
    'Accept': '*/*',
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.code === 'ECONNABORTED') {
      // Timeout hatası
      return Promise.reject({
        message: 'İstek zaman aşımına uğradı. Lütfen daha sonra tekrar deneyin.'
      });
    }

    if (!error.response) {
      // Network hatası
      return Promise.reject({
        message: 'Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.'
      });
    }

    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Token yenileme işlemi burada yapılabilir
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          // Refresh token ile yeni token alma işlemi
          // const response = await refreshTokenApi(refreshToken);
          // await AsyncStorage.setItem('userToken', response.data.token);
          // originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
          // return api(originalRequest);
        }
      } catch (refreshError) {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('refreshToken');
        // Login sayfasına yönlendirme işlemi burada yapılabilir
      }
    }

    return Promise.reject(error);
  }
);

export default api; 