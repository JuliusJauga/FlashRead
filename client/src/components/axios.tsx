import axios from 'axios';
import React, { useEffect, useState } from 'react';

const PostComponent: React.FC = () => {
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get('https://localhost:5076');
                setPost(response.data);
            } catch (err) {
                setError('Error fetching post');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, []);

    const postTaskText = async () => {
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
        } catch (err) {
            console.error('Error posting task text', err);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            {post && (
                <>
                    <h1>{post.title}</h1>
                    <p>{post.body}</p>
                </>
            )}
            <button onClick={postTaskText}>Post Task Text</button>
        </div>
    );
};

export default PostComponent;