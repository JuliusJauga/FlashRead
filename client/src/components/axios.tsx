import axios from 'axios';

const fetchPostData = async (): Promise<string> => {
    try {
        const response = await axios.get('http://localhost:5076');
        return response.data;
    } catch (err) {
        console.error('Error fetching post:', err);
        return 'Error fetching post';
    }
};

const postTaskText = async (): Promise<string> => {
    try {
        const response = await axios.post('http://localhost:5076/postTaskText', {
            text: 'string'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            }
        });
        console.log('Post response:', response.data);
        return response.data;
    } catch (err) {
        console.error('Error posting task text:', err);
        return 'Error posting task text';
    }
};

export { fetchPostData, postTaskText };