import type { CSSProperties } from 'react';

import type { Dictionary } from '@/lib/i18n/dictionary';

const stepsData = [
  {
    title: 'Subscribe',
    text: (
      <>
        From subscribing until receiving your ready app—all in a short time.
      </>
    ),
  },
  {
    title: 'Send the Logo',
    text: "Send us your restaurant's logo, name, and preferred colors, and leave the rest to us.",
  },
  {
    title: 'Receive your App',
    text: 'A ready app with your complete visual identity, published on Google Play and the App Store.',
  },
];

function StepIcon() {
  return (
    <span className="step-icon" aria-hidden="true">
      <img src="/icons/arrowicon.svg" width="48" height="48" alt="" />
    </span>
  );
}

export default function Steps({ dict }: { dict?: Dictionary } = {}) {
  const steps = dict?.steps.items || [
    { title: 'Subscribe', text: 'From subscribing until receiving your ready app—all in a short time.' },
    { title: 'Send the Logo', text: "Send us your restaurant's logo, name, and preferred colors, and leave the rest to us." },
    { title: 'Receive your App', text: 'A ready app with your complete visual identity, published on Google Play and the App Store.' },
  ];
  const chip = dict?.steps.chip || 'How to Join';
  const title1 = dict?.steps.title1 || 'Nawy Order solves the problem';
  const title2 = dict?.steps.title2 || 'in 3 simple steps';
  const intro = dict?.steps.intro || 'From subscribing until receiving your ready app—all in a short time.';

  return (
    <section id="how-to-join" className="steps-section">
      <img
        className="steps-bowl"
        src="/images/bowl-chicken.jpg"
        width="140"
        height="269"
        alt=""
        aria-hidden="true"
        loading="lazy"
      />
      <div className="container steps-grid">
        <div className="steps-visual" data-reveal="left" style={{ '--reveal-delay': '50ms' } as CSSProperties}>
          <img
            className="steps-phone"
            src="/images/phoneimage.jpg"
            width="2476"
            height="2722"
            alt={dict?.steps.phoneAlt || 'Nawy Orders restaurant ordering app displayed on a smartphone'}
            loading="lazy"
          />
          <img
            className="steps-lemonada"
            src="/images/lemonada.jpg"
            width="810"
            height="1164"
            alt=""
            aria-hidden="true"
            loading="lazy"
          />
        </div>

        <div
          className="steps-copy"
          data-reveal="right"
          style={{ '--reveal-delay': '150ms' } as CSSProperties}
        >
          <span className="steps-chip">
            <span>{chip}</span>
          </span>
          <h2 className="section-title">
            {title1}{' '}
            <br />
            {title2}
          </h2>
          <p className="steps-intro">{intro}</p>

          <ol className="steps-list">
            {steps.map((step, index) => (
              <li key={step.title} data-reveal="left" style={{ '--reveal-delay': `${index * 140}ms` } as CSSProperties}>
                <StepIcon />
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
