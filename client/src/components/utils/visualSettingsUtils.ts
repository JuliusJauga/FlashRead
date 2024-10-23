import axios from '../../components/axiosWrapper';

export const changeFont = (font: string) => {
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

export const changeTheme = async (theme: string) => {
    try {
        const response = await axios.get('/api/Settings/GetThemeSettingsByTheme', {
            params: { theme: theme.toLowerCase() }
        });
        const themeSettings = response.data;
        console.log('Received theme settings:', themeSettings);
        document.documentElement.style.setProperty('--backgroundColor', themeSettings.mainBackground);
        document.documentElement.style.setProperty('--secondaryColor', themeSettings.secondaryBackground);
        document.documentElement.style.setProperty('--textColor', themeSettings.textColor);
        document.documentElement.style.setProperty('--primaryColor', themeSettings.primaryColor);
        document.documentElement.style.setProperty('--accentColor', themeSettings.accentColor);
        document.documentElement.style.setProperty('--borderColor', themeSettings.borderColor);
    } catch (err) {
        console.error('Error fetching theme settings:', err);
    }
}