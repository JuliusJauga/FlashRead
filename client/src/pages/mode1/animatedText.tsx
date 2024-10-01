import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';

interface AnimatedTextProps {
    text: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text }) => {
        const [visibleText, setVisibleText] = useState('');

        useEffect(() => {
                let index = 0;
                const interval = setInterval(() => {
                        setVisibleText((prev) => prev + text[index]);
                        index++;
                        if (index === text.length) {
                                clearInterval(interval);
                        }
                }, 25); // Adjust the delay (in milliseconds) to control the speed of appearance

                return () => clearInterval(interval); // Cleanup interval on unmount
        }, [text]);

        return (
                <Typography variant="body1">
                        {visibleText.split('').map((char, index) => (
                                <span key={index}>{char}</span>
                        ))}
                </Typography>
        );
};

export default AnimatedText;
