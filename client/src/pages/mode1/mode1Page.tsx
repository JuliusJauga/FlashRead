import React from 'react';
import { Button, Container, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import axios from '../../components/axiosWrapper';
import * as mode1Task from './mode1Task';
const Mode1Page: React.FC = () => {
    const [mode1Data, setMode1Data] = React.useState<mode1Task.Mode1TaskData | undefined>(undefined);
    return (
        <Container>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Button variant="contained" color="primary">Return</Button>
                <Box display="flex" justifyContent="center" flexGrow={1}>
                    <TextField
                        select
                        label="Theme"
                        variant="outlined"
                        margin="normal"
                        SelectProps={{
                            native: true,
                        }}
                        defaultValue="--"
                    >
                        <option value="any">--</option>
                        <option value="history">History</option>
                        <option value="technology">Technology</option>
                        <option value="anime">Anime</option>
                        <option value="politics">Politics</option>
                    </TextField>
                    <TextField
                        select
                        label="Difficulty"
                        variant="outlined"
                        margin="normal"
                        SelectProps={{
                            native: true,
                        }}
                        defaultValue="--"
                    >
                        <option value="any">--</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                        <option value="extreme">Extreme</option>
                    </TextField>
                    <TextField
                        label="Timer"
                        type="text"
                        variant="outlined"
                        margin="normal"
                        InputProps={{
                            inputProps: { pattern: "\\d{2}:\\d{2}" } // Pattern for 00:00 format
                        }}
                        helperText="Set timer in MM:SS format"
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const value = e.target.value.replace(/[^0-9:]/g, '');
                            const match = value.match(/^(\d{0,2}):?(\d{0,2})$/);
                            if (match) {
                                e.target.value = `${match[1]}${match[2] ? ':' + match[2] : ''}`;
                            } else {
                                e.target.value = value.slice(0, 5);
                            }
                        }}
                    />

            </Box>
            <Box mb={2}>
                <Typography variant="h6">Text Container</Typography>
                <Box 
                    border={1} 
                    borderColor="grey.400" 
                    p={1} 
                    borderRadius={4} 
                    display="flex" 
                    flexDirection="column" 
                    alignItems="flex-start"
                    sx={{
                        transition: 'max-height 0.5s ease-in-out',
                        maxHeight: mode1Data ? '500px' : '0',
                        overflow: 'hidden'
                    }}
                >
                    {mode1Data && (
                        <Typography variant="body1" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                            {mode1Data.text}
                        </Typography>
                    )}
                </Box>
            </Box>
            </Box>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={async () => {
                    const taskRequest = {
                        taskId: 1,
                        theme: (document.querySelector('input[label="Theme"]') as HTMLInputElement).value,
                        difficulty: (document.querySelector('input[label="Difficulty"]') as HTMLInputElement).value,
                        timer: (document.querySelector('input[label="Timer"]') as HTMLInputElement).value,
                    } as mode1Task.Task1Request;
                    const response = await mode1Task.requestTask1Data(taskRequest);
                    console.log('Task data:', response);
                    setMode1Data(response || { session: 1, text: 'Default text if no data is returned.' });
        
                }}
            >
                Start
            </Button>
        </Container>
    );
};

export default Mode1Page;