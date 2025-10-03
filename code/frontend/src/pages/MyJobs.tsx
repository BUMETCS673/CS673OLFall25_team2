/*
 AI-generated code: 20% Formatting help with GPT
    - Tool: ChatGPT (link: https://chatgpt.com/share/68d43c9d-4d60-8006-a1a7-14ae49475a5a)
 Human code: 80% functions/classes: MyJobs component
 Framework-generated code: 0%
*/

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
