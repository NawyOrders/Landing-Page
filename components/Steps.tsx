import type { CSSProperties } from 'react';

const steps = [
  {
    title: 'Subscribe',
    text: (
      <>
        From subscribing until receiving your ready app…
        <br className="step-break" /> all in a short time.
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
      <svg viewBox="0 0 44 48" focusable="false">
        <path d="M7 4v40" stroke="#e43820" strokeWidth="2.8" strokeLinecap="round" />
        <path
          d="M16.5 11.5 40 24 16.5 36.5Z"
          fill="#fcdfd8"
          stroke="#e43820"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function Steps() {
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
            src="/images/steps-visual.jpg"
            width="660"
            height="780"
            alt="Nawy Orders phone app next to a splash of fresh orange juice"
            loading="lazy"
          />
        </div>

        <div
          className="steps-copy"
          data-reveal="right"
          style={{ '--reveal-delay': '150ms' } as CSSProperties}
        >
          <span className="steps-chip">
            <span>How to Join</span>
          </span>
          <h2 className="section-title">
            Nawy Order solves the problem{' '}
            <br />
            in 3 simple steps
          </h2>
          <p className="steps-intro">
            From subscribing until receiving your ready app… all in a short time.
          </p>

          <ol className="steps-list">
            {steps.map((step, index) => (
              <li key={step.title} data-reveal style={{ '--reveal-delay': `${index * 120}ms` } as CSSProperties}>
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
