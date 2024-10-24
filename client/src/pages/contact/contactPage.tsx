import React from 'react';
import '../../boards/css/contact.css';

import CustomButton from "../../components/buttons/customButton.tsx";
import { useNavigate } from 'react-router-dom';

const AboutPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="contactPage">
            <div className="pageContainer">
                <div className="header">
                    <h1>Contacts</h1>
                </div>

                <div className="content">
                    <p>COMING SOON</p>
                </div>

                <div className="footer">
                <CustomButton label="Return" className="wideButton" id="settingsReturnButton" onClick={() => navigate("/home")}/>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;