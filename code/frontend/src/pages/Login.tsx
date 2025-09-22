import Header from '../components/headerAndFooter/Header';
import Footer from '../components/headerAndFooter/Footer';
import Layout from '../components/wrapper/Layout';
import LoginForm from '../components/loginAndRegistration/LoginForm';


export default function Login() {
  return (
    <Layout
      header={<Header />}
      mainContent={<LoginForm showSubmitButton={true} />}
      footer={<Footer />}
    />
  );
}
