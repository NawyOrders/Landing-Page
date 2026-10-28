import type { CSSProperties } from 'react';
import type { Dictionary } from '@/lib/i18n/dictionary';

const phones = [
  {
    image: '/images/brand-pink.jpg',
  },
  {
    image: '/images/brand-yellow.jpg',
  },
  {
    image: '/images/brand-green.jpg',
  },
];

export default function Brand({ dict }: { dict?: Dictionary } = {}) {
  const items = dict?.brand.items || [
    { title: 'Appetite Boost', sub: 'Colors that drive sales' },
    { title: 'Natural Vibes', sub: 'Fresh and organic feel' },
    { title: 'Cool Trust', sub: 'Builds customer confidence' },
  ];
  const title1 = dict?.brand.title1 || 'We provide you with an app';
  const title2 = dict?.brand.title2 || 'customized';
  const title3 = dict?.brand.title3 || 'exclusively for';
  const title4 = dict?.brand.title4 || 'your brand identity';
  const subtitle = dict?.brand.subtitle || "As soon as you send us your restaurant's logo and colors, we will create your app with your complete visual identity.";

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
        <div className="brand-head" data-reveal style={{ '--reveal-delay': '50ms' } as CSSProperties}>
          <h2 className="section-title">
            {title1} <span className="accent">{title2}</span>{' '}
            <br />
            {title3} <span className="accent">{title4.split(' ')[0]}</span> {title4.split(' ').slice(1).join(' ')}
          </h2>
          <p>{subtitle}</p>
        </div>

        <div className="brand-grid">
          {items.map((item, index) => (
            <article
              key={item.title}
              className="brand-card"
              data-reveal="zoom"
              style={{ '--reveal-delay': `${index * 180}ms` } as CSSProperties}
            >
              <div className="brand-visual">
                <img
                  src={phones[index]?.image || '/images/brand-pink.jpg'}
                  width="400"
                  height="500"
                  alt={`Nawy Orders app with a ${item.title.toLowerCase()} color theme`}
                  loading="lazy"
                />
              </div>
              <h3>{item.title}</h3>
              <p>{item.sub}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
