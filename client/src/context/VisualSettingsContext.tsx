import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../components/axiosWrapper';
import Cookies from 'js-cookie';
import { changeFont, changeTheme } from '../components/utils/visualSettingsUtils.ts';
import { useAuth } from './AuthContext';

interface VisualSettings {
  theme: string;
  font: string;
}

interface VisualSettingsContextProps {
  visualSettings: VisualSettings;
  setVisualSettings: React.Dispatch<React.SetStateAction<VisualSettings>>;
}

const defaultSettings: VisualSettings = {
  theme: 'Olive',
  font: 'Poppins',
};

const VisualSettingsContext = createContext<VisualSettingsContextProps | undefined>(undefined);

export const VisualSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visualSettings, setVisualSettings] = useState<VisualSettings>(defaultSettings);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      console.log("AUTHENTICATED IN VISUALSETTINGSCONTEXT");
      const getAuthSettings = async () => {
        console.log("Getting theme from db");
        const themeResponse = await axios.get('/api/User/GetThemeSettings');
        const theme = themeResponse.data;
        changeTheme(theme.theme);
        changeFont(defaultSettings.font);
      }
      getAuthSettings();
    } else {
      console.log("NOT AUTHENTICATED IN VISUALSETTINGSCONTEXT");
      const getSettingsFromCookie = async () => {
        console.log("Getting theme from cookie");
        const settingsJson = Cookies.get('visualSettings');
        if (settingsJson) {
          const settings = JSON.parse(settingsJson);
          setVisualSettings(settings);
          changeTheme(settings.theme);
          changeFont(settings.font);
        } else {
          console.log("Loading default theme");
          changeTheme(defaultSettings.theme);
          changeFont(defaultSettings.font);
        }        
      }
      getSettingsFromCookie();
    }
  }, [isAuthenticated]);

  return (
    <VisualSettingsContext.Provider value={{ visualSettings, setVisualSettings }}>
      {children}
    </VisualSettingsContext.Provider>
  );
};

export const useVisualSettings = (): VisualSettingsContextProps => {
  const context = useContext(VisualSettingsContext);
  if (!context) {
    throw new Error('useVisualSettings must be used within a VisualSettingsProvider');
  }
  return context;
};