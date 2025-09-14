import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/headerAndFooter/Header';
import Footer from './components/headerAndFooter/Footer';
import Main from './pages/Main';
import MyJobs from './pages/MyJobs';

function App() {
  return (
    <BrowserRouter>
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Header />
        
        {/* This is the new container for your page content */}
        <main style={{ 
          flex: 1,
          maxWidth: '1280px',
          width: '100%',
          margin: '0 auto',
          padding: '2rem'
        }}>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/my-jobs" element={<MyJobs />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
