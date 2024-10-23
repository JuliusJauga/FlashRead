import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { changeFont, changeTheme } from '../components/utils/visualSettingsUtils.ts';

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

  useEffect(() => {
    const settingsJson = Cookies.get('visualSettings');
    if (settingsJson) {
      const settings = JSON.parse(settingsJson);
      setVisualSettings(settings);
      changeTheme(settings.theme);
      changeFont(settings.font);
    } else {
      changeTheme(defaultSettings.theme);
      changeFont(defaultSettings.font);
    }
  }, []);

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