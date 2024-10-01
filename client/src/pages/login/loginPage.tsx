import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import CustomHyperlink from '../../components/buttons/hyperlink';
import axios from '../../components/axiosWrapper';
import CustomButton from "../../components/buttons/customButton.tsx";
import '../../boards/css/loginPage.css';
import '../../boards/css/buttons.css';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted:', { email, password });
        axios.post('/api/users/login', { email, password })
            .then(response => {
                console.log('Login successful:', response.data);
            })
            .catch(error => {
                console.error('Login failed:', error);
            });
    };
    return (
        <div className="loginPage">

            <div className="loginContainer" id="loginContainer">

                <div className="loginPage_topDiv">
                    <h1 className="loginPage_title">Welcome back!</h1>
                </div>

                <div className="loginPage_loginDiv">
                    <input type="text" className="signinInput" id="signinEmailInput" placeholder="Username"/>
                    <input type="password" className="signinInput" id="signinPasswordInput" placeholder="Password"/>
                    <CustomButton label="Login" className="loginButton" id="loginPage_loginButton" onClick={() => navigate("/")}/>
                </div>

                <div className="loginPage_bottomDiv">
                    <h1 className="loginPage_noAccountText">Don't have an account?</h1>

                    <div className="loginPage_links">
                        <CustomHyperlink href="/register" label="Register " className="hyperlink" onClick={() => navigate("/register")} />
                        <span className="smallText"> or </span>
                        <CustomHyperlink href="/guest" label=" continue as guest" className="hyperlink" onClick={() => navigate("/")} />
                    </div>

                {/* <CustomButton label="Return" className="loginPage_returnButton" onClick={() => handlePageChange("selectionPage")}/> */}
                </div>

            </div>

        </div>

        // <Container maxWidth="sm" className="shadow-lg bg-grey p-10" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        //     <Box>
        //     <Box mb={10}>
        //         <Typography variant="h3" className="text-center mb-6">Login</Typography>
        //     </Box>
        //     <Box component="form" onSubmit={handleSubmit} className="space-y-4">
        //         <TextField
        //         fullWidth
        //         label="Email"
        //         type="email"
        //         variant="outlined"
        //         value={email}
        //         onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        //         required
        //         />
        //         <TextField
        //         fullWidth
        //         label="Password"
        //         type="password"
        //         variant="outlined"
        //         value={password}
        //         onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        //         required
        //         />
        //         <Button 
        //             type="submit" 
        //             variant="contained" 
        //             color="primary" 
        //             fullWidth
        //             onClick={() => {
        //                 if (!email || !password) {
        //                     if (!email) {
        //                         //alert('Please fill in the email.');
        //                     } else if (!password) {
        //                         //alert('Please fill in the password.');
        //                     }
        //                 } else {
        //                     handleSubmit(new Event('submit') as unknown as React.FormEvent);
        //                 }
        //             }}
        //         >
        //             Login
        //         </Button>
        //     </Box>
        //         <Box mt={4} className="text-center">
        //             <Typography variant="body1">
        //                 <Button color="secondary" onClick={() => navigate("/")}>
        //                     Continue as Guest
        //                 </Button>
        //             </Typography>
        //             <Typography variant="body1">
        //                 Don't have an account? <Button color="secondary" onClick={() => navigate("/register")}>Sign up</Button>
        //             </Typography>
        //         </Box>
        //     </Box>
        // </Container>
    );
};
export default LoginPage;

