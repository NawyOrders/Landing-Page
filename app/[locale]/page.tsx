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
import { getDictionary, type Locale } from '@/lib/i18n';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const loc = locale as Locale;

  return (
    <>
      <Header dict={dict} locale={loc} />
      <main id="main">
        <Hero dict={dict} />
        <Features dict={dict} />
        <Steps dict={dict} />
        <Brand dict={dict} />
        <DarkCta dict={dict} />
        <Pricing dict={dict} locale={loc} />
        <Testimonials dict={dict} />
        <Faq dict={dict} />
        <QrCta dict={dict} />
      </main>
      <Footer dict={dict} />
    </>
  );
}
