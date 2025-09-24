/*
 AI-generated code: 0%

 Human code: 100% functions/classes: Register component

 Framework-generated code: 0%
*/


import Header from '../components/headerAndFooter/Header';
import Footer from '../components/headerAndFooter/Footer';
import Layout from '../components/wrapper/Layout';
import RegisterForm from '../components/loginAndRegistration/RegisterForm';


export default function Register() {
  return (
    <Layout
      header={<Header />}
      mainContent={<RegisterForm showSubmitButton={true} />}
      footer={<Footer />}
    />
  );
}
