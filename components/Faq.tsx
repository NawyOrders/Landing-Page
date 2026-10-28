import type { CSSProperties } from 'react';
import RegisterLink from './RegisterLink';
import { ArrowIcon } from './Icons';

const faqs = [
  {
    q: 'What is Nawy Orders?',
    a: 'A platform that helps restaurant owners build their own ordering app and website with their own visual identity, plus a dashboard to manage orders, menus, and daily sales.',
  },
  {
    q: 'Do you take a commission on my orders?',
    a: 'No. Orders reach you in full, with zero commission or percentage taken from your profits. You keep every pound your restaurant earns.',
  },
  {
    q: 'How long does the setup take?',
    a: 'From subscribing until receiving your ready app, everything happens in a short time. Our team contacts you within 48 hours and walks you through the whole process.',
  },
  {
    q: 'What is included in the plans?',
    a: 'Both packages include menu and item management, daily sales reports, two connected branches, email support, and a website/PWA. Growth adds the Android and iOS app.',
  },
  {
    q: 'Can the app match my restaurant brand?',
    a: 'Yes. Send us your logo, name, and preferred colors, and we will create your app with your complete visual identity before publishing it on Google Play and the App Store.',
  },
];

export default function Faq() {
  return (
    <section id="faq" className="faq-section" aria-labelledby="faq-title">
      <div className="container">
        <header className="faq-head" data-reveal style={{ '--reveal-delay': '50ms' } as CSSProperties}>
          <span className="chip">FAQ</span>
          <h2 id="faq-title" className="section-title">
            Frequently asked <span className="accent">questions</span>
          </h2>
          <p className="section-sub">Everything you need to know before getting started.</p>
        </header>

        <div className="faq-layout">
          <div className="faq-list">
            {faqs.map((item, index) => (
              <details
                key={item.q}
                data-reveal="left"
                style={{ '--reveal-delay': `${index * 100}ms` } as CSSProperties}
              >
                <summary>
                  {item.q}
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path
                      d="M6 9.5 12 15l6-5.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>

          <aside
            className="faq-aside"
            data-reveal="right"
            style={{ '--reveal-delay': '400ms' } as CSSProperties}
          >
            <span className="faq-aside-eyebrow">Need a hand?</span>
            <h3>Still have a question?</h3>
            <p>
              Talk to our team. We will walk you through setup, plans, and the app that fits
              your restaurant.
            </p>
            <RegisterLink className="btn btn--primary">
              Talk to our team
              <ArrowIcon />
            </RegisterLink>
            <p className="faq-aside-note">We usually reply within 48 hours.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
