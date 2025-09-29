/*
 AI-generated code: 20% Formatting help with GPT

 Human code: 80% functions/classes: MyJobs component

 Framework-generated code: 0%
*/

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/headerAndFooter/Header';
import Layout from '../components/wrapper/Layout';
import Aside from '../components/asideAndToggler/Aside';
import Footer from '../components/headerAndFooter/Footer';
import { fetchWithAuth } from '../api/apiClient';

function MyJobsContent() {
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'error'
  const navigate = useNavigate();

  // The API call is now in a function we can call directly
  const handleFetchJobs = async () => {
    setStatus('loading');
    try {
      await fetchWithAuth('/api/myjobs', {}, navigate);
      // Success case would go here
    } catch (err: any) {
      if (err.message !== 'Unauthorized') {
        setStatus('error');
      }
      // If the error IS 'Unauthorized', the navigation happens inside fetchWithAuth
    }
  };

  return (
    <div className="container py-4">
      <h1 className="mb-3">My Jobs</h1>
      <p>Here you'll see and manage all your saved job applications.</p>
      
      {/* ADD THIS BUTTON */}
      <button onClick={handleFetchJobs}>Fetch Jobs</button>

      {status === 'loading' && <p>Loading...</p>}
      {status === 'error' && <p role="alert">Error fetching jobs.</p>}
    </div>
  );
}

// The rest of the file stays the same
export default function MyJobs() {
  return (
    <Layout
      header={<Header />}
      mainContent={<MyJobsContent />}
      aside={<Aside />}
      footer={<Footer />}
    />
  );
}