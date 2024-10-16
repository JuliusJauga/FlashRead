import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import CustomButton from "../../components/buttons/customButton.tsx";
import CustomHyperlink from '../../components/buttons/hyperlink';
import '../../boards/css/loginPage.css';
import '../../boards/css/buttons.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { register } from '../../services/authService';

const RegisterPage: React.FC = () => {
    const { checkUserAuth, isAuthenticated } = useAuth();
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home');
        }
    }, [isAuthenticated, navigate]);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register(email, password, username);
            checkUserAuth();
        } catch (error) {
            setError('Register failed. Please try again.');
        }
    };
    return (
        <div className="registerPage">

            <div className="registerContainer" id="registerContainer">

            <div className="registerPage_topDiv">
                <h1 className="loginPage_title">Create an account</h1>
            </div>

            <div className="registerPage_registerDiv">
            <TextField 
                        variant='outlined'
                        label="Username"
                        value={username}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderWidth: '3px',
                                    borderColor: 'var(--borderColor)', // Default border color
                                },
                                '&:hover fieldset': {
                                    borderWidth: '3px',
                                    borderColor: 'var(--borderColor)', // Border color on hover
                                },
                                '&.Mui-focused fieldset': {
                                    borderWidth: '3px',
                                    borderColor: '#1976d2', // Border color when focused
                                },
                        
                                width: '100%',
                            },
                        }}
                    />
                <TextField
                    variant='outlined'
                    label="Email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderWidth: '3px',
                                borderColor: 'var(--borderColor)', // Default border color
                            },
                            '&:hover fieldset': {
                                borderWidth: '3px',
                                borderColor: 'var(--borderColor)', // Border color on hover
                            },
                            '&.Mui-focused fieldset': {
                                borderWidth: '3px',
                                borderColor: '#1976d2', // Border color when focused
                            },
                    
                            width: '100%',
                        },
                    }}
                />
                <TextField
                    label="Password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    type="password"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderWidth: '3px',
                                borderColor: 'var(--borderColor)', // Default border color
                            },
                            '&:hover fieldset': {
                                borderWidth: '3px',
                                borderColor: 'var(--borderColor)', // Border color on hover
                            },
                            '&.Mui-focused fieldset': {
                                borderWidth: '3px',
                                borderColor: '#1976d2', // Border color when focused
                            },
                    
                            width: '100%',
                        },
                    }}
                />
                <TextField
                    label="Repeat password"
                    value={repeatPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRepeatPassword(e.target.value)}
                    type="password"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderWidth: '3px',
                                borderColor: 'var(--borderColor)', // Default border color
                            },
                            '&:hover fieldset': {
                                borderWidth: '3px',
                                borderColor: 'var(--borderColor)', // Border color on hover
                            },
                            '&.Mui-focused fieldset': {
                                borderWidth: '3px',
                                borderColor: '#1976d2', // Border color when focused
                            },
                    
                            width: '100%',
                        },
                    }}
                />
                <CustomButton 
                    label="Register" 
                    className="loginButton" 
                    id="registerPage_registerButton" 
                    onClick={() => {
                        console.log('Form submitted:', { username, email, password, repeatPassword });
                        if (!username || !email || !password || !repeatPassword) {
                            if (!username) {
                                alert('Please fill in the username.');
                            } else if (!email) {
                                alert('Please fill in the email.');
                            } else if (!password) {
                                alert('Please fill in the password.');
                            } else if (!repeatPassword) {
                                alert('Please fill in the repeat password.');
                            }
                        } else if (password !== repeatPassword) {
                            alert('Passwords do not match.');
                        } else {
                            handleSubmit(new Event('submit') as unknown as React.FormEvent);
                        }
                    }}
                />
            </div>

            <div className="registerPage_bottomDiv">
                <h1 className="loginPage_noAccountText">Already have an account?</h1>

                <div className="loginPage_links">
                    <CustomHyperlink href="/login" label="Login " className="hyperlink" onClick={() => navigate("/login")} />
                    <span className="smallText"> or </span>
                    <CustomHyperlink href="/guest" label=" continue as guest" className="hyperlink" onClick={() => navigate("/home")} />
                </div>
            </div>

            </div>   

        </div>     
    );
};

export default RegisterPage;

