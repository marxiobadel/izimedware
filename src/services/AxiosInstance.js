import axios from 'axios';
import { store } from '../store/store';

const env = 'prod'; // 'welly', 'prod', 'local'

let baseURL = '';

switch (env) {
    case 'local':
        baseURL = 'http://localhost:8000/api/'
        break;
    case 'prod':
        baseURL = 'https://medware.izipresta.com/api/'
        break;
    default:
        baseURL = '`https://react-course-b798e-default-rtdb.firebaseio.com/'
        break;
}

const axiosInstance = axios.create({baseURL});

if (env === 'welly') {
    axiosInstance.interceptors.request.use((config) => {
        const state = store.getState();
        const token = state.auth.auth.idToken;
        config.params = config.params || {};
        config.params['auth'] = token;
        return config;
    });
} else {
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
}

export default axiosInstance;
