import React, { useState, useEffect } from 'react';
import axios from '../../components/axiosWrapper';
import { useNavigate } from 'react-router-dom';
import '../../boards/css/settings.css';
import CustomButton from '../../components/buttons/customButton';
import EditableField from '../../components/editableField';
// import '../components/css/editableField.css';
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

const fetchFonts = async (): Promise<string[]> => {
    try {
        const response = await axios.get('/api/Settings/GetAllFonts');
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
    const [fonts, setFonts] = useState<string[]>([]);
    const [font, setFont] = useState<string>(visualSettings.font);

    const fetchAndSetThemes = async () => {
        const fetchedThemes = await fetchThemes();
        const capitalizedThemes = fetchedThemes.map(theme => theme.charAt(0).toUpperCase() + theme.slice(1));
        setThemes(capitalizedThemes);
    };

    const fetchAndSetFonts = async () => {
        const fetchedFonts = await fetchFonts();
        const capitalizedFonts = fetchedFonts.map(font => font.charAt(0).toUpperCase() + font.slice(1));
        setFonts(capitalizedFonts);
    };

    const fetchSettings = async () => {
        console.log("ATTEMPTING TO FETCH SETTINGS");
        try {
            const themeResponse = await axios.get('/api/User/GetThemeSettings');
            const capitalizedTheme = themeResponse.data.theme.charAt(0).toUpperCase() + themeResponse.data.theme.slice(1);
            const capitalizedFont = themeResponse.data.font.charAt(0).toUpperCase() + themeResponse.data.font.slice(1);
            setTheme(capitalizedTheme);
            setFont(capitalizedFont);
            console.log("FETCHED THEME: ", capitalizedTheme, " SET THEME TO: ", theme);
            console.log("FETCHED FONT: ", capitalizedFont, " SET FONT TO: ", font);
        } catch (err) {
            console.error('Error fetching settings:', err);
        }
    }

    useEffect(() => {
        fetchAndSetThemes();
        fetchAndSetFonts();

        if (isAuthenticated) {
            console.log("AUTHENTICATED IN USE EFFECT");
            fetchSettings();
        } else {
            console.log("NOT AUTHENTICATED IN USE EFFECT");
            const getSettingsFromCookie = async () => {
                const settingsJson = Cookies.get('visualSettings');
                if (settingsJson) {
                    const settings = JSON.parse(settingsJson);
                    const capitalizedTheme = settings.theme.charAt(0).toUpperCase() + settings.theme.slice(1);
                    setTheme(capitalizedTheme);
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

    if(!isAuthenticated) {
        return (
            <div className="settingsPage">
                <div className="settingsHeader">
                    <h1 className="settingsHeaderText">Settings</h1>
                </div>
    
                <div className="settingsContent">
                    <SettingsChoiceBox label="Theme" value={theme} options={themes} onChange={choice => handleThemeChange(choice)}/>
                    <SettingsChoiceBox label="Font" value={font} options={fonts} onChange={choice => handleFontChange(choice)}/>
                </div>
    
                <div className="settingsFooter">
                    <CustomButton label="Return" className="wideButton" id="settingsReturnButton" onClick={() => navigate("/home")}/>
                </div>
            </div>
        );       
    } else {
        return (
            <div className="settingsPage">
                <div className="settingsHeader">
                    <h1 className="settingsHeaderText">Settings</h1>
                </div>
    
                <div className="settingsContentAuth">
                    <div className="settingsColumn">
                        <SettingsChoiceBox label="Theme" value={theme} options={themes} onChange={choice => handleThemeChange(choice)}/>
                        <SettingsChoiceBox label="Font" value={font} options={fonts} onChange={choice => handleFontChange(choice)}/>
                    </div>
                    <div className="settingsColumn">
                        <EditableField label="Profile Name" initialValue={"profileName"} onSave={() => {}}  />
                        <EditableField label="Email" initialValue={"email"} onSave={() => {}} />
                        <div className="settingsButtonContainer">
                            <CustomButton label="Change Password" className="wideButton" id="settingsChangePasswordButton" onClick={() => navigate("/changePassword")}/>
                            <CustomButton label="Delete Account" className="wideButton" id="settingsDeleteAccountButton" onClick={() => navigate("/deleteAccount")}/>
                        </div>
                    </div>
                </div>
    
                <div className="settingsFooter">
                    <CustomButton label="Return" className="wideButton" id="settingsReturnButton" onClick={() => navigate("/home")}/>
                </div>
            </div>
        );
    }
}

export default SettingsPage;