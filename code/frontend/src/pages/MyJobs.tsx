// MyJobs.tsx
// 100% human written

import { useState } from 'react';
import Header from '../components/headerAndFooter/Header';
import Layout from '../components/wrapper/Layout';
import Aside from '../components/asideAndToggler/Aside';
import Footer from '../components/headerAndFooter/Footer';
import MyJobsViewList from '../components/jobsList/MyJobsViewList';

export default function MyJobs() {
  const [view, setView] = useState<'saved' | 'applied'>('saved');

  return (
    <Layout
      header={<Header />}
      mainContent={<MyJobsViewList view={view} onChangeView={setView} />}
      aside={<Aside />}
      footer={<Footer />}
    />
  );
}
