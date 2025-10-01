// App.tsx
// Author: Pedro Ramirez
// Pedro wrote this component to define the main application structure and routing

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import MyJobs from './pages/MyJobs';
import Content from './pages/Content';
import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/content" element={<Content />} />
        <Route path="/myJobs" element={<MyJobs />} />
      </Routes>
    </BrowserRouter>
  );
}
