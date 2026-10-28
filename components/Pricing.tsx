'use client';

import { useId, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { CheckIcon } from './Icons';
import RegisterLink from './RegisterLink';
import type { Dictionary } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n';

type Billing = 'monthly' | 'yearly';

export default function Pricing({ dict, locale }: { dict: Dictionary; locale?: Locale }) {
  const plans = dict.pricing.plans;
  const [billing, setBilling] = useState<Billing>('yearly');
  const yearly = billing === 'yearly';
  const plansId = useId();

  function handleBillingKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const { key } = event;
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key)) {
      return;
    }

    event.preventDefault();
    const next: Billing =
      key === 'Home'
        ? 'monthly'
        : key === 'End'
          ? 'yearly'
          : billing === 'monthly'
            ? 'yearly'
            : 'monthly';

    setBilling(next);
    event.currentTarget
      .querySelectorAll<HTMLButtonElement>('[role="radio"]')
      [next === 'monthly' ? 0 : 1]?.focus();
  }

  return (
    <section id="pricing" className="pricing-section">
      <img
        className="pricing-wok"
        src="/images/wok.jpg"
        width="280"
        height="310"
        alt=""
        aria-hidden="true"
        loading="lazy"
      />
      <div className="container">
        <header className="pricing-head" data-reveal>
          <h2 className="section-title">
            {dict.pricing.title1} <span className="accent">{dict.pricing.title2}</span> {locale === 'ar' ? '' : 'every stage'}
          </h2>
          <p className="section-sub">
            {dict.pricing.subtitle}
          </p>
        </header>

        <div
          className={`billing-toggle${yearly ? ' is-yearly' : ''}`}
          data-reveal
          role="radiogroup"
          aria-label="Billing period"
          onKeyDown={handleBillingKeyDown}
        >
          <span className="billing-thumb" aria-hidden="true" />
          <button
            type="button"
            role="radio"
            aria-checked={billing === 'monthly'}
            aria-controls={plansId}
            tabIndex={billing === 'monthly' ? 0 : -1}
            onClick={() => setBilling('monthly')}
          >
            {dict.pricing.monthly}
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={billing === 'yearly'}
            aria-controls={plansId}
            tabIndex={billing === 'yearly' ? 0 : -1}
            onClick={() => setBilling('yearly')}
          >
            {dict.pricing.yearly}
          </button>
        </div>

        <p className="billing-note" aria-live="polite" aria-atomic="true">
          <span key={billing}>{yearly ? dict.pricing.billingNoteYearly : dict.pricing.billingNoteMonthly}</span>
        </p>

        <div
          id={plansId}
          className={`plans-grid${yearly ? '' : ' is-monthly'}`}
          data-billing={billing}
        >
          {plans.map((plan, index) => (
            <article
              key={plan.key}
              className={`plan-card plan-card--${plan.key === 'growth' ? 'dark' : 'light'}`}
              data-reveal="flipup"
              data-billing={billing}
              style={{ '--reveal-delay': `${index * 160}ms` } as CSSProperties}
            >
              <h3>{plan.name}</h3>
              <p className="plan-desc">{plan.desc}</p>

              <div
                key={billing}
                className="plan-prices"
                aria-live="polite"
                aria-atomic="true"
              >
                {(yearly ? plan.prices.yearly : plan.prices.monthly).map((price) => (
                  <p className="plan-price" key={price.amount + price.term}>
                    <span className="plan-amount">{price.amount}</span>
                    <span className="plan-term">{price.term}</span>
                  </p>
                ))}
              </div>

              <ul className="plan-features">
                {plan.features.map((feature) => (
                  <li key={feature.text} className={feature.disabled ? 'is-disabled' : undefined}>
                    <CheckIcon disabled={feature.disabled} />
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>

              <div className="plan-cta">
                <RegisterLink className="btn btn--primary plan-btn">
                  {plan.cta}
                </RegisterLink>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
