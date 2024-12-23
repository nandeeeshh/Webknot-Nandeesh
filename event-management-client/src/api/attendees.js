import axios from 'axios';


const API_URL = 'http://192.168.29.51:5000/attendees';


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


export const getAttendees = async () => {
  try {
    const response = await API.get('/');
    return response.data;
  } catch (error) {
    console.error('Error fetching attendees:', error.response?.data || error.message);
    throw error;
  }
};

export const createAttendee = async (attendee) => {
  try {
    const response = await API.post('/', attendee);
    return response.data;
  } catch (error) {
    console.error('Error creating attendee:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteAttendee = async (eventId) => {
  try {
    const response = await API.delete(`/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting attendee:', error.response?.data || error.message);
    throw error;
  }
};



export default API;
