import React, { useState } from 'react';

const TimerInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, id, ...props }) => {
    // State to keep track of the raw input as a sequence of digits
    const [inputSequence, setInputSequence] = useState<string>('000');

    // Helper function to format the input sequence into "m:ss"
    const formatToTimer = (sequence: string) => {
        // Ensure the sequence has at least 3 digits, padding with leading zeros if necessary
        const paddedSequence = sequence.padStart(3, '0');
        // Extract the last two digits as seconds and the remaining as minutes
        const minutes = parseInt(paddedSequence.slice(0, -2), 10);
        const seconds = parseInt(paddedSequence.slice(-2), 10);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Handler for input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, ''); // Remove any non-digit characters
        if (value.length <= 3) {
            setInputSequence(value);
        } else if (value.length > 3) {
            // Allow typing only up to 3 digits
            setInputSequence(value.slice(-3)); // Take only the last 3 digits
        }
    };

    // Construct the display value in "m:ss" format based on the input sequence
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
