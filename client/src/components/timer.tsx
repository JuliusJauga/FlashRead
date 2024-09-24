import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import '../boards/css/timer.css';

interface TimerProps {
    className?: string;
    id?: string;
    onClick?: () => void;
}

const Timer = forwardRef(({ id, onClick }: TimerProps, ref) => {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [buttonLabelIndex, setButtonLabelIndex] = useState(0);

    const buttonLabels = ['Start', 'Stop', 'Confirm', 'Again'];

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;

        if (isActive) {
            interval = setInterval(() => {
                setSeconds(prev => prev + 1);
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isActive, seconds]);

    // Expose the reset function
    useImperativeHandle(ref, () => ({
        reset: () => {
            setSeconds(0);
            setIsActive(false);
            setButtonLabelIndex(0);
        }
    }));

    const handleButtonClick = () => {
        const currentLabel = buttonLabels[buttonLabelIndex];

        if (currentLabel === 'Start') {
            setIsActive(true);
        } else if (currentLabel === 'Stop') {
            setIsActive(false);
        } else if (currentLabel === 'Again') {
            setSeconds(0);
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