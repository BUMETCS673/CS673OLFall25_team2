/*
 AI-generated code: 20% Formatting help with GPT

 Human code: 80% functions/classes: MyJobs component

 Framework-generated code: 0%
*/


import Header from '../components/headerAndFooter/Header';
import Layout from '../components/wrapper/Layout';
import Aside from '../components/asideAndToggler/Aside';
import Footer from '../components/headerAndFooter/Footer';

// This is the specific content for this page
function MyJobsContent() {
    return (
    <div className="container py-4">
      <h1 className="mb-3">My Jobs</h1>
      <p>Here you'll see and manage all your saved job applications.</p>
    </div>
  );
}

// The main export uses the Layout to wrap the page content
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
