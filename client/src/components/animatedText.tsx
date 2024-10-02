import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import "../boards/css/mode1.css";

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
                        if (index === text.length-1) {
                                clearInterval(interval);
                        }
                }, 50); // Adjust the delay (in milliseconds) to control the speed of appearance

                return () => clearInterval(interval); // Cleanup interval on unmount
        }, [text]);

        return (
            <Typography variant="body1" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {visibleText.split('').map((char, index) => (
                    <span key={index}>{char}</span>
                ))}
            </Typography>
        );
};

export default AnimatedText;
