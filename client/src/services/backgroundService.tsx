import axiosWrapper from '../components/axiosWrapper';

const updateSession = async () => {
    try {
        const response = await axiosWrapper.get('/api/Session/Update');
        console.log('Session updated:', response.data);
    } catch (error) {
        console.error('Error updating session:', error);
    }
};

export const startBackgroundService = () => {
    setInterval(updateSession, 60000);
};