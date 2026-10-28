import Header from '../../components/Header';
import Hero from '../../components/Hero';
import Features from '../../components/Features';
import Steps from '../../components/Steps';
import Brand from '../../components/Brand';
import DarkCta from '../../components/DarkCta';
import Pricing from '../../components/Pricing';
import Testimonials from '../../components/Testimonials';
import Faq from '../../components/Faq';
import QrCta from '../../components/QrCta';
import Footer from '../../components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Features />
        <Steps />
        <Brand />
        <DarkCta />
        <Pricing />
        <Testimonials />
        <Faq />
        <QrCta />
      </main>
      <Footer />
    </>
  );
}
