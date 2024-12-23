import axios from 'axios';

const API_URL = 'http://192.168.29.51:5000';


const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token); 
  } else {
    delete API.defaults.headers.common['Authorization'];
    localStorage.removeItem('token'); 
  }
};


export const login = async (credentials) => {
  try {
    const response = await API.post('/auth/login', credentials);
    const { token } = response.data; 
    setAuthToken(token); 
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};


export const registerr = async (credentials) => {
  try {
    const response = await API.post('/auth/register', credentials);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw error;
  }
};

export default API;

