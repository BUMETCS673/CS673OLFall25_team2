/*
 AI-generated code: 0%

 Human code: 100% functions/classes: Content component

 Framework-generated code: 0%
*/


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
