// Register.tsx
// 100% human written

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
