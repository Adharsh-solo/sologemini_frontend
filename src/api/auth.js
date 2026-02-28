import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'https://sologemini-backend1.onrender.com';

export const loginUser = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/api/token/`, {
            username,
            password,
        });
        if (response.data.access) {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
        }
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

export const registerUser = async (username, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/api/register/`, {
            username,
            email,
            password,
        });
        return response.data;
    } catch (error) {
        console.error('Error registering:', error);
        throw error;
    }
};

export const logoutUser = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

export const getAccessToken = () => {
    return localStorage.getItem('access_token');
};

export const fetchUser = async () => {
    try {
        const token = getAccessToken();
        if (!token) throw new Error('No token found');

        const response = await axios.get(`${API_URL}/api/user/`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};
