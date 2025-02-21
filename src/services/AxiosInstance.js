import axios from 'axios';
import { store } from '../store/store';

const axiosInstance = axios.create({baseURL: process.env.REACT_APP_BASE_URL});

axiosInstance.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.auth.auth.idToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        config.headers.Accept = 'application/json';
        config.withCredentials = true; 
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
