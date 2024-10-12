import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/home/homePage';
import RegisterPage from './pages/register/registerPage';
import LoginPage from './pages/login/loginPage';
import Mode1Page from './pages/mode1/mode1Page';
import Mode2Page from './pages/mode2/mode2Page';
import Mode3Page from './pages/mode3/mode3Page';
import SettingsPage from './pages/settings/settingsPage';

import './boards/css/variables.css';

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login"/>}/>
      <Route path="/home" element={<HomePage/>}/>
      <Route path="/register" element={<RegisterPage/>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/settings" element={<SettingsPage/>}/>
      <Route path="/mode1" element={<Mode1Page/>}/>
      <Route path="/mode2" element={<Mode2Page/>}/>
      <Route path="/mode3" element={<Mode3Page/>}/>
    </Routes>
  </BrowserRouter>
);

export default App;