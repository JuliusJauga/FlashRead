// src/services/authService.ts
import axiosWrapper from '../components/axiosWrapper';

const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Strict`;
};

export const login = async (email: string, password: string) => {
    try {
        const response = await axiosWrapper.post('/api/Users/Login', { email, password });

        const token = response.data.token;

        document.cookie = `authToken=${token}; path=/; Secure; SameSite=Strict`;
        console.log('Token: ', document.cookie);
        console.log('User authenticated, token stored in cookie');
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        return null;
    }
};

export const register = async (email: string, password: string, username: string) => {
    try {
        const response = await axiosWrapper.post('/api/Users/Register', { email, password, username });
        const token = response.data.token;
        document.cookie = `authToken=${token}; path=/; Secure; SameSite=Strict`;
        console.log('Token: ', document.cookie);
        console.log('User authenticated, token stored in cookie');
        return response.data;
    } catch (error) {
        console.error('Register error:', error);
        return null;
    }
}

export const logout = async () => {
    deleteCookie('authToken');
    return await checkAuth();
};

export const checkAuth = async () => {
    try {
        const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('authToken='));
        const token = tokenCookie ? tokenCookie.split('=')[1] : null;
        const response = await axiosWrapper.post('/api/Users/CheckAuth', {}, {
            headers: {
            'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.log('Token: ', document.cookie);
        console.error('Authentication check error:', error);
        return null;
    }
};
