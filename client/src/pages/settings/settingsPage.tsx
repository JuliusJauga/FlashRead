import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../boards/css/settings.css';

import CustomButton from '../../components/buttons/customButton';
import '../../boards/css/buttons.css';
import SettingsChoiceBox from '../../components/settingsChoiceBox';
import { access } from 'fs';

const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const [theme, setTheme] = React.useState<string>("Olive");
    const [font, setFont] = React.useState<string>("Poppins");
    const [fontSize, setFontSize] = React.useState<string>("Medium");

    const handleFontChange = (font: string) => {
        setFont(font);
        changeFont(font);
    }

    const changeFont = (font: string) => {
        let fontValue;
        switch (font) {
            case 'Poppins':
                fontValue = "\"Poppins\", sans-serif";
                break;
            case 'Merriweather':
                fontValue = "\"Merriweather\", serif";
                break;
            default:
                fontValue = "\"Poppins\", sans-serif";
                break;
        }
        document.documentElement.style.setProperty('--fontStyle', fontValue);
    }

    const handleThemeChange = (theme: string) => {
        setTheme(theme);
        changeTheme(theme);
    };

    const changeTheme = (theme: string) => {
        let mainBackground, secondaryBackground, textColor, primaryColor, accentColor,
            borderColor;
        switch (theme) {
            case 'Light':
                mainBackground = "#FFF";
                secondaryBackground = "#FFF8E8";
                primaryColor = "#FFF";
                accentColor = "#FFD6DA";
                textColor = "#383B42";
                borderColor = "#383B42";
                break;
            case 'Dark':
                mainBackground = "#26272C";
                secondaryBackground = "#555862";
                textColor = "#F8F2F4";
                primaryColor = "#26272C";
                accentColor = "#555862";
                borderColor = "#F8F2F4";
                break;
            case 'Olive':
                mainBackground = "#AAB396";
                secondaryBackground = "#808E67";
                textColor = "#FFF8E8";
                primaryColor = "#AAB396";
                accentColor = "#808E67";
                borderColor = "#FFF8E8";
                break;
            default:
                mainBackground = "#AAB396";
                secondaryBackground = "#808E67";
                textColor = "#FFF8E8";  
                primaryColor = "#AAB396";
                accentColor = "#808E67";
                borderColor = "#FFF8E8"; 
        }
        document.documentElement.style.setProperty('--backgroundColor', mainBackground);
        document.documentElement.style.setProperty('--secondaryColor', secondaryBackground);
        document.documentElement.style.setProperty('--textColor', textColor);
        document.documentElement.style.setProperty('--primaryColor', primaryColor);
        document.documentElement.style.setProperty('--accentColor', accentColor);
        document.documentElement.style.setProperty('--borderColor', borderColor);
    }

    return (
        <div className="settingsPage">
            <div className="settingsHeader">
                <h1 className="settingsHeaderText">Settings</h1>
            </div>

            <div className="settingsContent">
                <SettingsChoiceBox label="Theme" value={theme} options={["Light", "Dark", "Olive"]} onChange={choice => handleThemeChange(choice)}/>
                <SettingsChoiceBox label="Font" value={font} options={["Poppins", "Merriweather"]} onChange={choice => handleFontChange(choice)}/>
            </div>

            <div className="settingsFooter">
                <CustomButton label="Return" className="wideButton" id="settignsdReturnButton" onClick={() => navigate("/home")}/>
            </div>
        </div>
    );
}

export default SettingsPage;