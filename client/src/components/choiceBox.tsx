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
      <FormControl fullWidth variant="outlined" className="choice-box-form-control"
       sx={{
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderWidth: '4px',
                borderColor: '#FFF8E8', // Default border color
            },
            '&:hover fieldset': {
                borderWidth: '3px',
                borderColor: '#FFF8E8', // Border color on hover
            },
            '&.Mui-focused fieldset': {
                borderWidth: '3px',
                borderColor: '#1976d2', // Border color when focused
            },
    
            width: '100%',
        },
      }}
      >
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
