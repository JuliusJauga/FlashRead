import React, { useState, useEffect } from 'react';
import axios from '../../components/axiosWrapper';
import { useNavigate } from 'react-router-dom';
import '../../boards/css/settings.css';
import CustomButton from '../../components/buttons/customButton';
import '../../boards/css/buttons.css';
import SettingsChoiceBox from '../../components/settingsChoiceBox';
import { useAuth } from '../../context/AuthContext';
import Cookies from 'js-cookie';

const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const { checkUserAuth, isAuthenticated } = useAuth();
    const [theme, setTheme] = useState<string>("Olive");
    const [font, setFont] = useState<string>("Poppins");

    useEffect(() => {
        if (isAuthenticated) {
            const fetchSettings = async () => {
                try {
                    const response = await axios.post('/api/GetSettings');
                    const data = response.data;
                    setTheme(data.theme);
                    setFont(data.font);
                    console.log('Received theme:', data.theme);
                    console.log('Received font:', data.font);
                    changeTheme(data.theme);
                    changeFont(data.font);
                } catch (err) {
                    console.error('Error fetching settings:', err);
                }
            };
    
            fetchSettings();
        } else {
            const settingsJson = Cookies.get('visualSettings');
            if (settingsJson) {
                const settings = JSON.parse(settingsJson);
                setTheme(settings.theme);
                setFont(settings.font);
                console.log('Loaded theme from cookie:', settings.theme);
                console.log('Loaded font from cookie:', settings.font);
                changeTheme(settings.theme);
                changeFont(settings.font);
            }            
        }
    }, []);

    const handleFontChange = (font: string) => {
        setFont(font);
        changeFont(font);
        updateSettings({ theme, font });
    }

    const handleThemeChange = (theme: string) => {
        setTheme(theme);
        changeTheme(theme);
        updateSettings({ theme, font });
    };

    const updateSettings = async (settings: { theme: string, font: string }) => {
        if (isAuthenticated) {
            try {
                await axios.post('/api/UpdateSettings', settings);
            } catch (err) {
                console.error('Error updating settings:', err);
            }
        } else {
            saveSettingsToCookie(settings);
        }
    
    }

    const saveSettingsToCookie = (settings: { theme: string, font: string }) => {
        const settingsJson = JSON.stringify(settings);
        document.cookie = `visualSettings=${settingsJson}; path=/; Secure; SameSite=Strict`;
        console.log('Settings saved to cookie:', document.cookie);
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

    const changeTheme = (theme: string) => {
        let mainBackground, secondaryBackground, textColor, primaryColor, accentColor, borderColor;
        switch (theme) {
            case 'Light':
                mainBackground = "#F8F8FA";
                secondaryBackground = "#F1F1F5";
                primaryColor = "#FFF";
                accentColor = "#FFD6DA";
                textColor = "#383B42";
                borderColor = "#383B42";
                break;
            case 'Dark':
                mainBackground = "#0F171E";
                secondaryBackground = "#26272C"; 
                textColor = "#F8F2F4";
                primaryColor = "#080709";
                accentColor = "#111013";
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
                <CustomButton label="Return" className="wideButton" id="settingsReturnButton" onClick={() => navigate("/home")}/>
            </div>
        </div>
    );
}

export default SettingsPage;