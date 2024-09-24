import React, { useState } from 'react';

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
    <div>
      <label htmlFor="choice-box">{label}</label>
      <select
        id="choice-box"
        value={selectedChoice}
        onChange={handleSelect}
        style={{ padding: '0.5rem', fontSize: '1rem', marginLeft: '0.5rem' }}
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
