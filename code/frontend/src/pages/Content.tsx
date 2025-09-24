// Content.tsx
// Author: Pedro Ramirez
// Pedro wrote this component to compose the main layout using the Layout component
// and include Header, Footer, Aside, and JobList components

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
