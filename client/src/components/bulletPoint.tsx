import React, { useState } from 'react';

interface BulletPoint {
    id: number;
}

const BulletPoints: React.FC = () => {
    const [selectedBullet, setSelectedBullet] = useState<number | null>(null);

    const bulletPoints: BulletPoint[] = [
        { id: 1 },
        { id: 2 },
        { id: 3 }
    ];

    const handleSelect = (id: number) => {
        setSelectedBullet(id); // Only the clicked bullet will be selected
    };

    return (
        <ul>
            {bulletPoints.map((bullet) => (
                <li
                    key={bullet.id}
                    onClick={() => handleSelect(bullet.id)}
                    style={{
                        cursor: 'pointer',
                        listStyleType: selectedBullet === bullet.id ? 'disc' : 'circle', // 'disc' for filled, 'circle' for empty
                        fontSize: '24px', // Adjust font size for better visibility
                        marginBottom: '10px'
                    }}
                >
                    {selectedBullet === bullet.id ? `Bullet ${bullet.id}` : ''}
                </li>
            ))}
        </ul>
    );
};

export default BulletPoints;
