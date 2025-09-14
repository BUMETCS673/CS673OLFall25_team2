import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import MyJobs from './pages/MyJobs';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/my-jobs" element={<MyJobs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
