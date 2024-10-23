import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/home/homePage';
import RegisterPage from './pages/register/registerPage';
import LoginPage from './pages/login/loginPage';
import Mode1Page from './pages/mode1/mode1Page';
import Mode2Page from './pages/mode2/mode2Page';
import SettingsPage from './pages/settings/settingsPage';
import ChangePasswordPage from './pages/settings/changePassword';
import DeleteAccountPage from './pages/settings/deleteAccount';
import axios from './components/axiosWrapper';
import './boards/css/variables.css';
import { AuthProvider } from './context/AuthContext';
import { VisualSettingsProvider } from './context/VisualSettingsContext';
import { useEffect } from 'react';
const App: React.FC = () => {
    const sendUpdateRequest = async () => {
      try {
        const response = await axios.get('/api/Session/Update');
        console.log("Update request sent successfully:", response.data);
      } catch (error) {
        console.error("Failed to send update request:", error);
      }
    };
  
    useEffect(() => {
      const intervalId = setInterval(() => {
        sendUpdateRequest();
      }, 60000);
  
      return () => {
        clearInterval(intervalId);
      };
    }, []);
  
    return (
      <AuthProvider>
        <VisualSettingsProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/mode1" element={<Mode1Page />} />
              <Route path="/mode2" element={<Mode2Page />} />
              <Route path="/changePassword" element={<ChangePasswordPage/>}/>
          <Route path="/deleteAccount" element={<DeleteAccountPage/>}/>
        </Routes>
          </BrowserRouter>
        </VisualSettingsProvider>
      </AuthProvider>
    );
  };
  
  export default App;