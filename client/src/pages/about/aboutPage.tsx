import React from 'react';
import '../../boards/css/about.css';

import CustomButton from "../../components/buttons/customButton.tsx";
import { useNavigate } from 'react-router-dom';

const AboutPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="aboutPage">
            <div className="pageContainer">
                <div className="header">
                    <h1>About Us</h1>
                </div>

                <div className="content">
                    <p>Welcome to FlashRead! We are dedicated to providing the best reading experience for our users.</p>
                    <p>Our mission is to make reading accessible and enjoyable for everyone.</p>
                    <p>Thank you for choosing FlashRead!</p>
                </div>

                <div className="footer">
                <CustomButton label="Return" className="wideButton" id="settingsReturnButton" onClick={() => navigate("/home")}/>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;