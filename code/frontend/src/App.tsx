import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/myJobs" element={<div>My Jobs Page</div>} />
        <Route path="/" element={<div>Main Page</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
