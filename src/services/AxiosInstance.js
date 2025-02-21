import axios from 'axios';
import { store } from '../store/store';

let baseURL = '';

switch (process.env.REACT_APP_ENV) {
    case 'local':
        baseURL = 'http://localhost:8000/api/'
        break;
    case 'production':
        baseURL = 'https://medware.izipresta.com/api/'
        break;
    default:
        baseURL = 'https://react-course-b798e-default-rtdb.firebaseio.com/'
        break;
}

const axiosInstance = axios.create({baseURL});


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
