import axios from 'axios';

const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('authToken='));
const token = tokenCookie ? tokenCookie.split('=')[1] : null;

const axiosWrapper = axios.create({
    baseURL: 'http://localhost:5076',
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    },
});

export default axiosWrapper;