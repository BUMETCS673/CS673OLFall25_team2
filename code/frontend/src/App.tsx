import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './components/loginAndRegistration/LoginForm';
import RegisterForm from './components/loginAndRegistration/RegisterForm';
import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/main" element={<div>Main Page</div>} />
        <Route path="/myJobs" element={<div>My Jobs Page</div>} />
      </Routes>
    </BrowserRouter>
  );
}
