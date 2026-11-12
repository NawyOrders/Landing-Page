import type { CSSProperties } from 'react';
import { CheckIcon } from './Icons';
import RegisterLink from './RegisterLink';
import type { Dictionary } from '@/lib/i18n/dictionary';

export default function Pricing({ dict }: { dict: Dictionary }) {
  const plans = dict.pricing.plans;

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
            {dict.pricing.title1} <span className="accent">{dict.pricing.title2}</span>
          </h2>
          <p className="section-sub">{dict.pricing.subtitle}</p>
        </header>

        <div className="plans-grid">
          {plans.map((plan, index) => (
            <article
              key={plan.key}
              className="plan-card plan-card--light"
              data-reveal="flipup"
              style={{ '--reveal-delay': `${index * 160}ms` } as CSSProperties}
            >
              <h3>{plan.name}</h3>
              <p className="plan-desc">{plan.desc}</p>

              <div className="plan-prices">
                {plan.prices.map((price) => (
                  <p className="plan-price" key={price.amount + price.term}>
                    <span className="plan-term">{price.term}</span>
                    <span className="plan-equals" aria-hidden="true">=</span>
                    <span className="plan-amount">{price.amount}</span>
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
