import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import '../boards/css/timer.css';

interface TimerProps {
    className?: string;
    id?: string;
    onClick?: () => void;
    initialTime?: number; // Initial time in seconds
    onComplete?: () => void; // New prop for when the timer reaches 0
}
export interface TimerHandle {
    reset: () => void;
    getTime: () => number;
}



const Timer = forwardRef(({ id, onClick, initialTime = 0, onComplete }: TimerProps, ref) => {
    const [seconds, setSeconds] = useState(initialTime); // Set initial time
    const [isActive, setIsActive] = useState(false);
    const [buttonLabelIndex, setButtonLabelIndex] = useState(0);

    const buttonLabels = ['Start', 'Stop', 'Confirm', 'Again'];

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;

        if (isActive) {
            interval = setInterval(() => {
                setSeconds((prev) => {
                    if (initialTime > 0) { // Countdown mode
                        if (prev === 0) {
                            setIsActive(false);
                            setButtonLabelIndex(2); // Switch to "Confirm" when countdown ends
                            clearInterval(interval);
                            if (onComplete) {
                                onComplete(); // Call the onComplete function
                            }
                            return prev;
                        }
                        return prev - 1;
                    } else { // Regular timer mode
                        return prev + 1;
                    }
                });
            }, 1000);
        } else if (!isActive && seconds !== (initialTime > 0 ? initialTime : 0)) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isActive, seconds, initialTime, onComplete]);

    // Update the seconds state whenever the initialTime prop changes
    useEffect(() => {
        if (!isActive) {
            setSeconds(initialTime); // Update seconds immediately with new initialTime
        }
    }, [initialTime]);

    // Expose the reset function
    useImperativeHandle(ref, () => ({
        reset: () => {
            setSeconds(initialTime); // Reset to the latest initialTime
            setIsActive(false);
            setButtonLabelIndex(0); // Reset to "Start"
        }
    }));

    const getTime = () => seconds;

    const handleButtonClick = () => {
        const currentLabel = buttonLabels[buttonLabelIndex];

        if (currentLabel === 'Start') {
            setIsActive(true); // Start the timer
        } else if (currentLabel === 'Stop') {
            setIsActive(false); // Pause the timer
        } else if (currentLabel === 'Again') {
            setSeconds(initialTime); // Reset to initial time on 'Again'
        }

        if (onClick) {
            onClick();
        }

        setButtonLabelIndex((prevIndex) => (prevIndex + 1) % buttonLabels.length);
    };


    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <div className="timer-container">
            <div className="timer-text-container">
                <h1>Timer: {formatTime(seconds)}</h1>
            </div>
            <button onClick={handleButtonClick} className="toggle-button" id={id}>
                {buttonLabels[buttonLabelIndex]}
            </button>
        </div>
    );
});

export default Timer;
