import type { CSSProperties } from 'react';
import RegisterLink from './RegisterLink';
import { ArrowIcon } from './Icons';

import type { Dictionary } from '@/lib/i18n/dictionary';

export default function Faq({ dict }: { dict?: Dictionary } = {}) {
  const faqs = dict?.faq.items || [];
  const aside = dict?.faq.aside;

  return (
    <section id="faq" className="faq-section" aria-labelledby="faq-title">
      <div className="container">
        <header className="faq-head" data-reveal style={{ '--reveal-delay': '50ms' } as CSSProperties}>
          <span className="chip">{dict?.faq.chip || 'FAQ'}</span>
          <h2 id="faq-title" className="section-title">
            {dict?.faq.title1 || 'Frequently asked'} <span className="accent">{dict?.faq.title2 || 'questions'}</span>
          </h2>
          <p className="section-sub">{dict?.faq.subtitle || 'Everything you need to know before getting started.'}</p>
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
            <span className="faq-aside-eyebrow">{aside?.eyebrow || 'Need a hand?'}</span>
            <h3>{aside?.title || 'Still have a question?'}</h3>
            <p>
              {aside?.text || 'Talk to our team. We will walk you through setup, plans, and the app that fits your restaurant.'}
            </p>
            <RegisterLink className="btn btn--primary" style={{ animation: 'pulseGentle 2.5s ease-in-out infinite' }}>
              {aside?.cta || 'Talk to our team'}
              <ArrowIcon />
            </RegisterLink>
            <p className="faq-aside-note">{aside?.note || 'We usually reply within 48 hours.'}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
