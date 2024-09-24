import React, { useState } from 'react';

interface BulletPointsProps {
    choices: string[];
}

const BulletPoints: React.FC<BulletPointsProps> = ({ choices }) => {
    const [selectedBullet, setSelectedBullet] = useState<number | null>(null);

    const handleSelect = (id: number) => {
        setSelectedBullet(id); // Only the clicked bullet will be selected
    };

    return (
        <ul>
            {choices.map((choice, index) => (
                <li
                    key={index}
                    onClick={() => handleSelect(index)}
                    style={{
                        cursor: 'pointer',
                        listStyleType: selectedBullet === index ? 'disc' : 'circle', // 'disc' for filled, 'circle' for empty
                        fontSize: '32px', // Larger font size for bullet points
                        marginBottom: '10px',
                        display: 'flex',
                    }}
                >
                    <span style={{ fontSize: '24px' }}> {/* Smaller font size for text */}
                        {choice}
                    </span>
                </li>
            ))}
        </ul>
    );
};

export default BulletPoints;
