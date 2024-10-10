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
                borderWidth: '3px',
                color: 'var(--textColor)', // Default border color
                borderColor: 'var(--borderColor)', // Default border color
            },
            '&:hover fieldset': {
                borderWidth: '3px',
                color: 'var(--textColor)', // Border color on hover
                borderColor: 'var(--borderColor)', // Border color on hover
            },
            '&.Mui-focused fieldset': {
                borderWidth: '3px',
                borderColor: '#1976d2', // Border color when focused
            },
    
            width: '100%',
        },
      }}
      >
        <InputLabel className="choice-box-label" 
        sx={{
          color: 'var(--textColor)', // Normal state color
          '&.Mui-focused': {
            color: '#1976d2', // Focused state color
          },
          '&.MuiFormLabel-filled': {
            color: 'var(--textColor)', // When the input has a value
          },
          '&.Mui-focused.MuiFormLabel-filled': {
                color: '#1976d2', // Focused and has a value
            },
        }}
        >{label}</InputLabel>
        <Select
          value={selectedChoice}
          onChange={handleSelect}
          label={label}
          className="choice-box-select"
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: 'var(--backgroundColor)',
                color: 'var(--textColor)',
              },
            },
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'var(--textColor)',
            '& .MuiSelect-select': {
              color: 'var(--textColor)', // Ensure the selected text color is set
            },
            '& .MuiSelect-select.MuiSelect-placeholder': {
              color: 'var(--textColor)', // Placeholder text color
            },
          }}
        >
          <MenuItem value="" disabled sx={{color: 'var(--textColor)', textAlign: 'center'}}>
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
