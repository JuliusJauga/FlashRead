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
                        fontSize: '26px', // Increased font size for larger bullets
                        fontFamily: '"Poppins", sans-serif',
                        marginBottom: '10px',
                        color: '#FFF8E8',
                    }}
                >
                    {choice} {/* Always show the bullet point text */}
                </li>
            ))}
        </ul>
    );
};

export default BulletPoints;
