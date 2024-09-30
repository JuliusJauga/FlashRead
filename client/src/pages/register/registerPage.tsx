import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from '../../components/axiosWrapper';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted:', { username, email, password });
        axios.post('/api/users/register', { username, email, password })
            .then(response => {
                console.log('Registration successful:', response.data);
            })
            .catch(error => {
                console.error('Registration failed:', error);
            });
    };
    return (

        <Container maxWidth="sm" className="shadow-lg bg-grey p-10" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Box>
            <Box mb={10}>
                <Typography variant="h3" className="text-center mb-6">Register</Typography>
            </Box>
            <Box component="form" onSubmit={handleSubmit} className="space-y-4">
                <TextField
                fullWidth
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                required
                />
                <TextField
                fullWidth
                label="Email"
                type="email"
                variant="outlined"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
                />
                <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
                />
                <TextField
                fullWidth
                label="Repeat password"
                type="password"
                variant="outlined"
                value={repeatPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRepeatPassword(e.target.value)}
                required
                error={repeatPassword !== password}
                helperText={repeatPassword !== password ? "Passwords do not match" : ""}
                />

                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    onClick={() => {
                        if (!username || !email || !password || !repeatPassword) {
                            if (!username) {
                                //alert('Please fill in the username.');
                            } else if (!email) {
                                //alert('Please fill in the email.');
                            } else if (!password) {
                                //alert('Please fill in the password.');
                            } else if (!repeatPassword) {
                                //alert('Please fill in the repeat password.');
                            } else if (password !== repeatPassword) {
                                //alert('Passwords do not match.');
                            }
                        } else {
                            handleSubmit(new Event('submit') as unknown as React.FormEvent);
                        }
                    }}
                >
                    Register
                </Button>
            </Box>
                <Box mt={4} className="text-center">
                    <Typography variant="body1">
                        <Button color="secondary" onClick={() => navigate("/")}>
                            Continue as Guest
                        </Button>
                    </Typography>
                    <Typography variant="body1">
                        Already have an account? <Button color="secondary" onClick={() => navigate("/login")}>Login</Button>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default RegisterPage;

