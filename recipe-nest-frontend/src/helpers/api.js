import axios from 'axios';
import { BACKEND_API_URL } from './constants';

const api = axios.create({
    baseURL: BACKEND_API_URL,
    withCredentials: true,
});

export default api;