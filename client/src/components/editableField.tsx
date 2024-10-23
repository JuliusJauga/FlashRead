import React, { useState, useEffect } from 'react';
import CustomButton from './buttons/customButton';
import './css/editableField.css'; // Import the CSS file

interface SettingsButtonProps {
    label: string;
    initialValue: string;
    onSave: (value: string) => void;
}

const EditableField: React.FC<SettingsButtonProps> = ({ label, initialValue, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleConfirmClick = () => {
        setIsEditing(false);
        onSave(value);
    };

    return (
        <div className="editableField-container">
            <div className="editableField-label">{label}</div>
            {isEditing ? (
                <input 
                    type="text" 
                    value={value} 
                    onChange={(e) => setValue(e.target.value)} 
                    className="editableField-input"
                />
            ) : (
                <div className="editableField-value">{value}</div>
            )}
            <button 
                onClick={isEditing ? handleConfirmClick : handleEditClick} 
                className="editableField-button"
            >
                {isEditing ? "Confirm" : "Edit"}
            </button>
        </div>
    );
};

export default EditableField;