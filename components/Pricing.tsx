'use client';

import { useId, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { CheckIcon } from './Icons';
import LeadButton from './LeadButton';

const plans = [
  {
    key: 'start',
    name: 'Start',
    desc: 'For restaurants starting their journey',
    tone: 'light',
    prices: {
      yearly: [
        { amount: '15,000 EGP', term: '/ 3 months' },
        { amount: '32,000 EGP', term: '/ 6 Months' },
        { amount: '60,000 EGP', term: '/ 12 months' },
      ],
      monthly: [{ amount: '6,000 EGP', term: '/ month' }],
    },
    features: [
      { text: 'Menu and item management' },
      { text: 'Daily sales reports' },
      { text: 'Two connected branches' },
      { text: 'Email support' },
      { text: 'Website, PWA' },
      { text: 'Android and iOS app', disabled: true },
    ],
    cta: 'Get Started',
  },
  {
    key: 'growth',
    name: 'Growth',
    desc: 'For growing and expanding restaurants',
    tone: 'dark',
    prices: {
      yearly: [
        { amount: '17,000 EGP', term: '/ 3 months' },
        { amount: '34,000 EGP', term: '/ 6 months' },
      ],
      monthly: [{ amount: '7,000 EGP', term: '/ month' }],
    },
    features: [
      { text: 'Menu and item management' },
      { text: 'Daily sales reports' },
      { text: 'Two connected branches' },
      { text: 'Email support' },
      { text: 'Website, PWA' },
      { text: 'Android and iOS app' },
    ],
    cta: 'Get Started',
  },
];

type Billing = 'monthly' | 'yearly';

export default function Pricing() {
  const [billing, setBilling] = useState<Billing>('yearly');
  const yearly = billing === 'yearly';
  const plansId = useId();
  const billingNote = yearly ? 'Billed yearly — choose your term' : 'Billed monthly';

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
            Two packages to <span className="accent">suit</span> every stage
          </h2>
          <p className="section-sub">
            Choose the package that fits your restaurant and start today
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
            Monthly
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={billing === 'yearly'}
            aria-controls={plansId}
            tabIndex={billing === 'yearly' ? 0 : -1}
            onClick={() => setBilling('yearly')}
          >
            Yearly
          </button>
        </div>

        <p className="billing-note" aria-live="polite" aria-atomic="true">
          <span key={billing}>{billingNote}</span>
        </p>

        <div
          id={plansId}
          className={`plans-grid${yearly ? '' : ' is-monthly'}`}
          data-billing={billing}
        >
          {plans.map((plan, index) => (
            <article
              key={plan.key}
              className={`plan-card plan-card--${plan.tone}`}
              data-reveal
              data-billing={billing}
              style={{ '--reveal-delay': `${index * 100}ms` } as CSSProperties}
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
                <LeadButton className="btn btn--primary plan-btn">
                  {plan.cta}
                </LeadButton>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
