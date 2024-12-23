import axios from 'axios';
import dayjs from 'dayjs';

// Base URL for the API
const API_URL = 'http://192.168.29.51:5000/events';

// Create an Axios instance
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


API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const getEvents = async () => {
  try {
    const response = await API.get('/');
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error.response?.data || error.message);
    throw error;
  }
};



export const createEvent = async (event) => {
  try {
    const formattedEvent = {
      ...event,
      date: dayjs(event.date).format('DD-MM-YYYY'), 
    };
    const response = await API.post('/', formattedEvent);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error.response?.data || error.message);
    throw error;
  }
};

export const updateEvent = async (id, updatedEvent) => {
  try {
    const response = await API.put(`/${id}`, updatedEvent);
    return response.data;
  } catch (error) {
    console.error('Error updating event:', error.response?.data || error.message);
    throw error;
  }
};


export const deleteEvent = async (id) => {
  try {
    const response = await API.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting event:', error.response?.data || error.message);
    throw error;
  }
};

export default getEvents;
