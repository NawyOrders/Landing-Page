import type { CSSProperties } from 'react';
import type { Dictionary } from '@/lib/i18n/dictionary';

const icons = [
  '/icons/hero/easysetup.svg',
  '/icons/hero/people.svg',
  '/icons/hero/security-safe.svg',
  '/icons/hero/bx_support.svg',
];

export default function FeatureStrip({ dict }: { dict: Dictionary }) {
  const items = dict.featureStrip.items;
  return (
    <div className="feature-strip-wrap" data-reveal style={{ '--reveal-delay': '450ms' } as CSSProperties}>
      <ul className="feature-strip">
        {items.map((item, index) => (
          <li key={item.title} style={{ animation: `slideUp 0.7s ease forwards ${index * 120 + 550}ms`, opacity: 0 }}>
            <span className="strip-icon">
              <img src={icons[index] || icons[0]} width="54" height="54" alt="" aria-hidden="true" />
            </span>
            <span className="strip-copy">
              <strong>{item.title}</strong>
              <small>{item.sub}</small>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
