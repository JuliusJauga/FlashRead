import React, { useEffect, useState } from 'react';

const BulletPoints: React.FC<{
    choices: string[],
    correctVariant?: number,
    selectedVariant?: number,
    onChanged?: (arg0: number) => void,
}> = ({ choices, correctVariant, selectedVariant, onChanged }) => {
    const [selectedBullet, setSelectedBullet] = useState<number>(-1);

    useEffect(() => { // Reset the selected bullet when the choices change
        setSelectedBullet(selectedVariant !== undefined ? selectedVariant : -1);
    }, [choices, selectedVariant]);

    useEffect(() => {
        if (onChanged) {
            onChanged(selectedBullet);
        }
    }, [selectedBullet, onChanged]);

    const getListStyleType = (index: number) => {
        if (index === selectedBullet) return 'disc';
        return 'circle';
    };
    const getColor = (index: number) => {
        if (correctVariant !== undefined && correctVariant !== null) {
            // if bullet is correct and selected, show green
            // if bullet is correct and not selected, show blue
            if (index === correctVariant) {
                return selectedVariant === correctVariant ? '#00FF00' : '#0000FF';
            }
            // if bullet is selected and incorrect, show red
            if (index === selectedBullet && index !== correctVariant) {
                return '#FF0000';
            }
        }
        // otherwise, show default
        return '#FFF8E8';   
    };

    return (
        <ul>
            {choices.map((choice, index) => (
                <li
                    key={index}
                    onClick={() => {
                        if (correctVariant !== undefined && correctVariant !== null) return; // disable selection if showing answer
                        setSelectedBullet(index);
                    }}
                    style={{
                        marginLeft: '1em', // Indent the bullet points
                        cursor: 'pointer',
                        listStyleType: getListStyleType(index), 
                        fontSize: '26px', // Increased font size for larger bullets
                        fontFamily: '"Poppins", sans-serif',
                        marginBottom: '10px',
                        padding: '0.5em',
                        color: getColor(index),
                    }}
                >
                    {choice} {/* Always show the bullet point text */}
                </li>
            ))}
        </ul>
    );
};

export default BulletPoints;
