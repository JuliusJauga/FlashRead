import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted:', { username, email, password });
    };

    return (
        <div className="bg-gray-1000">

        Hello
        </div>
    );

    return (

        <Container maxWidth="sm" className="bg-red">
            <Typography variant="h2" className="text-center mb-6">Register</Typography>
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
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Register
                </Button>
            </Box>
        </Container>
    );
};

export default RegisterPage;

