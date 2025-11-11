// /frontend/src/api/axios.ts
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api', // Apunta a tu backend
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;