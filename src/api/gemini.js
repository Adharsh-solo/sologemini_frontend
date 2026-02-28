import axios from 'axios';
import { getAccessToken } from './auth';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'https://sologemini-backend1.onrender.com';

const getAuthHeaders = () => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const sendChatMessage = async (message, history) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/chat/`,
      { message, history },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error in sendChatMessage:', error);
    throw error;
  }
};

export const fetchHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/history/`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error in fetchHistory:', error);
    throw error;
  }
};
