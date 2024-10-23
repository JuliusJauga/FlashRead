import React, { useState, useEffect } from 'react';
import axios from '../../components/axiosWrapper';
import { useNavigate } from 'react-router-dom';
import '../../boards/css/settings.css';
import CustomButton from '../../components/buttons/customButton';
import '../../boards/css/buttons.css';
import SettingsChoiceBox from '../../components/settingsChoiceBox';
import { useAuth } from '../../context/AuthContext';
import { useVisualSettings } from '../../context/VisualSettingsContext';
import Cookies from 'js-cookie';
import { changeFont, changeTheme } from '../../components/utils/visualSettingsUtils';

const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { visualSettings, setVisualSettings } = useVisualSettings();
    const [theme, setTheme] = useState<string>(visualSettings.theme);
    const [font, setFont] = useState<string>(visualSettings.font);

    useEffect(() => {
        if (isAuthenticated) {
            const fetchSettings = async () => {
                try {
                    const response = await axios.get('/api/GetSettings');
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
    }, [isAuthenticated]);

    const handleFontChange = (font: string) => {
        setFont(font);
        changeFont(font);
        const newSettings = { theme, font };
        setVisualSettings(newSettings);
        if (isAuthenticated) {
            updateSettings(newSettings);
        } else {
            saveSettingsToCookie(newSettings);
        }
    }

    const handleThemeChange = (theme: string) => {
        setTheme(theme);
        changeTheme(theme);
        const newSettings = { theme, font };
        setVisualSettings(newSettings);
        if (isAuthenticated) {
            updateSettings(newSettings);
        } else {
            saveSettingsToCookie(newSettings);
        }
    };

    const updateSettings = async (settings: { theme: string, font: string }) => {
        try {
            await axios.post('/api/UpdateSettings', settings);
        } catch (err) {
            console.error('Error updating settings:', err);
        }
    }

    const saveSettingsToCookie = (settings: { theme: string, font: string }) => {
        const settingsJson = JSON.stringify(settings);
        Cookies.set('visualSettings', settingsJson, { path: '/', secure: true, sameSite: 'Strict' });
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