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

const fetchThemes = async (): Promise<string[]> => {
    try {
        const response = await axios.get('/api/Settings/GetAllThemes');
        return response.data;
    } catch (err) {
        console.error('Error fetching themes:', err);
        return [];
    }
};


const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { visualSettings, setVisualSettings } = useVisualSettings();
    const [themes, setThemes] = useState<string[]>([]);
    const [theme, setTheme] = useState<string>(visualSettings.theme);
    const [font, setFont] = useState<string>(visualSettings.font);

    const fetchAndSetThemes = async () => {
        const fetchedThemes = await fetchThemes();
        const capitalizedThemes = fetchedThemes.map(theme => theme.charAt(0).toUpperCase() + theme.slice(1));
        setThemes(capitalizedThemes);
    };

    const fetchSettings = async () => {
        console.log("ATTEMPTING TO FETCH SETTINGS");
        try {
            const themeResponse = await axios.get('/api/User/GetThemeSettings');
            const capitalizedTheme = themeResponse.data.theme.charAt(0).toUpperCase() + themeResponse.data.theme.slice(1);
            setTheme(capitalizedTheme);
            console.log("FETCHED THEME: ", capitalizedTheme, " SET THEME TO: ", theme);
        } catch (err) {
            console.error('Error fetching settings:', err);
        }
    }

    useEffect(() => {
        fetchAndSetThemes();

        if (isAuthenticated) {
            console.log("AUTHENTICATED IN USE EFFECT");
            fetchSettings();
        } else {
            console.log("NOT AUTHENTICATED IN USE EFFECT");
            const getSettingsFromCookie = async () => {
                const settingsJson = Cookies.get('visualSettings');
                if (settingsJson) {
                    const settings = JSON.parse(settingsJson);
                    setTheme(settings.theme);
                    console.log('Loaded theme from cookie:', settings.theme);
                }
            }
            getSettingsFromCookie();
        }

        console.log("THEME IN USE EFFECT: ", theme);

        // if (isAuthenticated) {
        //     console.log("AUTHENTICATED");
        //     const fetchSettings = async () => {
        //         try {
        //             const themeResponse = await axios.get('/api/User/GetThemeSettings');
        //             const theme = themeResponse.data;
        //             setTheme(theme.theme);
        //             // setFont(data.font);
        //             console.log('Received theme:', theme.theme);
        //             console.log("FETCH THEME");
        //             // console.log('Received font:', data.font);
        //             changeTheme(theme.theme);
        //             // changeFont(data.font);
        //         } catch (err) {
        //             console.error('Error fetching settings:', err);
        //         }
        //     };
    
        //     fetchSettings();
        // } else {
        //     console.log("NOT AUTHENTICATED");
        //     const getSettingsFromCookie = async () => {
        //         const settingsJson = Cookies.get('visualSettings');
        //         if (settingsJson) {
        //             const settings = JSON.parse(settingsJson);
        //             setTheme(settings.theme);
        //             setFont(settings.font);
        //             console.log('Loaded theme from cookie:', settings.theme);
        //             console.log('Loaded font from cookie:', settings.font);
        //             console.log("COOKIE THEME");
        //             changeTheme(settings.theme);
        //             changeFont(settings.font);
        //         }
        //     }
        //     getSettingsFromCookie();
        // }
    }, []);

    
    
    const handleFontChange = (font: string) => {
        setFont(font);
        changeFont(font);
        sendSettingsUpdate(theme);
    }

    const handleThemeChange = async (theme: string) => {
        const lowerCaseTheme = theme.toLowerCase();
        setTheme(theme);
        changeTheme(lowerCaseTheme);
        sendSettingsUpdate(lowerCaseTheme);
    };

    const sendSettingsUpdate = (theme: string) => {
        const newSettings = { theme, font };
        setVisualSettings(newSettings);
        if (isAuthenticated) {
            updateSettings(newSettings);
        } else {
            saveSettingsToCookie(newSettings);
        }
    }

    const updateSettings = async (settings: { theme: string, font: string }) => {
        try {
            const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('authToken='));
            const token = tokenCookie ? tokenCookie.split('=')[1] : null;
            console.log("SETTINGS PAGE THEME IN UPDATE: ", settings.theme);
            await axios.post('/api/Settings/UpdateTheme', null, {
                params: { theme: settings.theme },
                headers: { Authorization: `Bearer ${token}` }
            });
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
                <SettingsChoiceBox label="Theme" value={theme} options={themes} onChange={choice => handleThemeChange(choice)}/>
                <SettingsChoiceBox label="Font" value={font} options={["Poppins", "Merriweather"]} onChange={choice => handleFontChange(choice)}/>
            </div>

            <div className="settingsFooter">
                <CustomButton label="Return" className="wideButton" id="settingsReturnButton" onClick={() => navigate("/home")}/>
            </div>
        </div>
    );
}

export default SettingsPage;