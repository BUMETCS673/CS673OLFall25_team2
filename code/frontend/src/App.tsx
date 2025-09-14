import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import MyJobs from './pages/MyJobs';
import LoginForm from './components/loginAndRegistration/LoginForm';
import RegisterForm from './components/loginAndRegistration/RegisterForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/my-jobs" element={<MyJobs />} />
        {/* routes for login/register */}
        <Route path="/login" element={<LoginForm showSubmitButton />} />
        <Route path="/register" element={<RegisterForm showSubmitButton />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;