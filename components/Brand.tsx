import type { CSSProperties } from 'react';

const phones = [
  {
    image: '/images/brand-pink.jpg',
    title: 'Appetite Boost',
    sub: 'Colors that drive sales',
  },
  {
    image: '/images/brand-yellow.jpg',
    title: 'Natural Vibes',
    sub: 'Fresh and organic feel',
  },
  {
    image: '/images/brand-green.jpg',
    title: 'Cool Trust',
    sub: 'Builds customer confidence',
  },
];

export default function Brand() {
  return (
    <section id="brand" className="brand-section">
      <img
        className="brand-plate"
        src="/images/small-plate.jpg"
        width="160"
        height="200"
        alt=""
        aria-hidden="true"
        loading="lazy"
      />
      <div className="container">
        <div className="brand-head" data-reveal>
          <h2 className="section-title">
            We provide you with an app <span className="accent">customized</span>{' '}
            <br />
            exclusively for <span className="accent">your</span> brand identity
          </h2>
          <p>
            As soon as you send us your restaurant&apos;s logo and colors, we will create your app
            with your complete visual identity.
          </p>
        </div>

        <div className="brand-grid">
          {phones.map((phone, index) => (
            <article
              key={phone.title}
              className="brand-card"
              data-reveal
              style={{ '--reveal-delay': `${index * 100}ms` } as CSSProperties}
            >
              <div className="brand-visual">
                <img
                  src={phone.image}
                  width="400"
                  height="500"
                  alt={`Nawy Orders app with a ${phone.title.toLowerCase()} color theme`}
                  loading="lazy"
                />
              </div>
              <h3>{phone.title}</h3>
              <p>{phone.sub}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
