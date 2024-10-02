import React, { useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import '../boards/css/choiceBox.css'; 

interface ChoiceBoxProps {
  choices: string[];
  prompt: string;
  onSelect: (choice: string) => void;
  label?: string;
}

const ChoiceBox: React.FC<ChoiceBoxProps> = ({ choices, prompt, onSelect, label = 'Choose an option:' }) => {
  const [selectedChoice, setSelectedChoice] = useState<string>('');

  const handleSelect = (event: SelectChangeEvent<string>) => {
    const choice = event.target.value;
    setSelectedChoice(choice);
    onSelect(choice);
  };

  return (
    <div className="choice-box-container">
      <FormControl fullWidth variant="outlined" className="choice-box-form-control">
        <InputLabel className="choice-box-label">{label}</InputLabel>
        <Select
          value={selectedChoice}
          onChange={handleSelect}
          label={label}
          className="choice-box-select"
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <MenuItem value="" disabled sx={{ textAlign: 'center'}}>
            {prompt}
          </MenuItem>
          {choices.map((choice, index) => (
            <MenuItem key={index} value={choice}>
              {choice}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default ChoiceBox;
