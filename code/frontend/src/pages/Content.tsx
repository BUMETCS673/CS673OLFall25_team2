// Content.tsx
// 100% human written

import Header from '../components/headerAndFooter/Header';
import Layout from '../components/wrapper/Layout';
import Aside from '../components/asideAndToggler/Aside';
import Footer from '../components/headerAndFooter/Footer';
import JobList from '../components/jobsList/JobsViewList';

export default function Content() {
  return (
    <Layout
      header={<Header />}
      mainContent={<JobList />}
      aside={<Aside />}
      footer={<Footer />}
    ></Layout>
  );
}
