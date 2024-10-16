import axios from 'axios';

const axiosWrapper = axios.create({
    baseURL: 'http://localhost:5076',
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosWrapper;