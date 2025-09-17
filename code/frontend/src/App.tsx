import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './components/loginAndRegistration/LoginForm';

export default function App() {
  return (
    <BrowserRouter>
      <LoginForm />
      <Routes>
        <Route path="/myJobs" element={<div>My Jobs Page</div>} />
        <Route path="/" element={<div>Main Page</div>} />
      </Routes>
    </BrowserRouter>
  );
}
