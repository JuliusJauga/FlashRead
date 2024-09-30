import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/home/homePage';
import RegisterPage from './pages/register/registerPage';
import LoginPage from './pages/login/loginPage';

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/register" element={<RegisterPage/>}/>
      <Route path="/login" element={<LoginPage/>}/>
    </Routes>
  </BrowserRouter>
);

export default App;