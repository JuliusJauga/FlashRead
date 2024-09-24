import React, { useState } from 'react';
import '../boards/css/choiceBox.css'; // Import the CSS file

interface ChoiceBoxProps {
  choices: string[];
  onSelect: (choice: string) => void;
  label?: string;  // Optional prop for the label
}

const ChoiceBox: React.FC<ChoiceBoxProps> = ({ choices, onSelect, label = 'Choose an option:' }) => {
  const [selectedChoice, setSelectedChoice] = useState<string>('');

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const choice = event.target.value;
    setSelectedChoice(choice);
    onSelect(choice);
  };

  return (
    <div className="choice-box-container">
      <label htmlFor="choice-box" className="choice-box-label">{label}</label>
      <select
        id="choice-box"
        value={selectedChoice}
        onChange={handleSelect}
        className="choice-box-select"
      >
        <option value="" disabled>
          Select...
        </option>
        {choices.map((choice, index) => (
          <option key={index} value={choice}>
            {choice}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ChoiceBox;