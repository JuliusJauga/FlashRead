import React, { useState, useEffect } from 'react';

interface TimerInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onTimeChange: (seconds: number) => void; // New prop to send the input time in seconds
}

const TimerInput: React.FC<TimerInputProps> = ({ className, id, onTimeChange, ...props }) => {
    const [inputSequence, setInputSequence] = useState<string>('0000');

    // Helper function to format the input sequence into "mm:ss"
    const formatToTimer = (sequence: string) => {
        const paddedSequence = sequence.padStart(4, '0');
        const minutes = paddedSequence.slice(0, 2);
        const seconds = paddedSequence.slice(2, 4);
        return `${minutes}:${seconds}`;
    };

    // Convert the input sequence into total seconds
    const convertToSeconds = (sequence: string) => {
        const paddedSequence = sequence.padStart(4, '0');
        const minutes = parseInt(paddedSequence.slice(0, 2), 10);
        const seconds = parseInt(paddedSequence.slice(2, 4), 10);
        return minutes * 60 + seconds;
    };

    // Handler for input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, ''); // Remove any non-digit characters
        if (value.length <= 4) {
            setInputSequence(value);
        } else if (value.length > 4) {
            // Allow typing only up to 4 digits
            setInputSequence(value.slice(-4)); 
        }
    };

    // Trigger the onTimeChange callback whenever the input sequence changes
    useEffect(() => {
        const totalSeconds = convertToSeconds(inputSequence);
        onTimeChange(totalSeconds);
    }, [inputSequence, onTimeChange]);

    // Construct the display value in "mm:ss" format based on the input sequence
    const displayValue = formatToTimer(inputSequence);

    return (
        <input
            type="text"
            value={displayValue}
            onChange={handleInputChange}
            className={className}
            id={id}
            {...props}
            style={{ textAlign: 'left' }}
        />
    );
};

export default TimerInput;
