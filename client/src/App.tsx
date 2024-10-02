import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/home/homePage';
import RegisterPage from './pages/register/registerPage';
import LoginPage from './pages/login/loginPage';
import Mode1Page from './pages/mode1/mode1Page';

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login"/>}/>
      <Route path="/home" element={<HomePage/>}/>
      <Route path="/register" element={<RegisterPage/>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/mode1" element={<Mode1Page/>}/>
    </Routes>
  </BrowserRouter>
);

export default App;