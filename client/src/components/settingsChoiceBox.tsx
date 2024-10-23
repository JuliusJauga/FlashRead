import React from 'react';
import './css/settingsChoiceBox.css';

interface SettingsChoiceBoxProps {
    label: string;
    value: string;
    options: string[];
    onChange: (newValue: string) => void;
}

const SettingsChoiceBox: React.FC<SettingsChoiceBoxProps> = ({ label, value, options, onChange }) => {
    return (
        <div className="settingsChoiceBox">
            <label className="settingsChoiceBoxLabel">{label}</label>
            <select className="settingsChoiceBoxSelect" value={value} onChange={(e) => onChange(e.target.value)}>
                {options.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default SettingsChoiceBox;