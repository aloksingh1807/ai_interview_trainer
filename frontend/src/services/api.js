import axios from 'axios';

const API = axios.create({
  baseURL: '', // Handled via Vite proxy target configurations
});

// Automate token insertions across outbound API requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
