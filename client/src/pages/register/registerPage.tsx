import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from '../../components/axiosWrapper';
import CustomButton from "../../components/buttons/customButton.tsx";
import CustomHyperlink from '../../components/buttons/hyperlink';
import '../../boards/css/loginPage.css';
import '../../boards/css/buttons.css';
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
        axios.post('/api/Users/Register', { email, password, username })
            .then(response => {
                console.log('Registration successful:', response.data);
            })
            .catch(error => {
                console.error('Registration failed:', error);
            });
    };
    return (
        <div className="registerPage">

            <div className="registerContainer" id="registerContainer">

            <div className="registerPage_topDiv">
                <h1 className="loginPage_title">Create an account</h1>
            </div>

            <div className="registerPage_registerDiv">
                <input type="text" className="signinInput" id="registerEmailInput" placeholder="Email"/>
                <input type="text" className="signinInput" id="registerUsernameInput" placeholder="Username"/>
                <input type="password" className="signinInput" id="registerPasswordInput" placeholder="Password"/>
                <input type="password" className="signinInput" id="registerPasswordInput2" placeholder="Confirm Password"/>
                <CustomButton label="Register" className="loginButton" id="registerPage_registerButton" onClick={() => navigate("/")}/>
            </div>

            <div className="registerPage_bottomDiv">
                <h1 className="loginPage_noAccountText">Already have an account?</h1>

                <div className="loginPage_links">
                    <CustomHyperlink href="/login" label="Login " className="hyperlink" onClick={() => navigate("/login")} />
                    <span className="smallText"> or </span>
                    <CustomHyperlink href="/guest" label=" continue as guest" className="hyperlink" onClick={() => navigate("/")} />
                </div>
            </div>

            </div>   

        </div>     
    );
};

export default RegisterPage;

