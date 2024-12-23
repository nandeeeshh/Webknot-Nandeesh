import axios from 'axios';
import dayjs from 'dayjs';

const API_URL = 'http://192.168.29.51:5000/tasks';

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


export const getTasks = async (eventId) => {
  try {
    const response = await API.get(`/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error.response?.data || error.message);
    throw error;
  }
};


export const createTask = async (task, token) => {

  const formattedDeadline = dayjs(task.deadline).format('DD-MM-YYYY');

  const taskData = {
    ...task,
    deadline: formattedDeadline,
  };

  const response = await API.post('/', taskData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


export const updateTask = async (id, updatedTask) => {
  try {
    const response = await API.put(`/${id}`, updatedTask);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error.response?.data || error.message);
    throw error;
  }
};

export const updateTaskStatus = async (taskId, status, token) => {
  const response = await API.put(`/${taskId}/status`, { status }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


export const deleteTask = async (id) => {
  try {
    const response = await API.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting task:', error.response?.data || error.message);
    throw error;
  }
};

export default getTasks;
