import type { CSSProperties } from 'react';
import type { Dictionary } from '@/lib/i18n/dictionary';

const icons = [
  (
    <svg viewBox="0 0 56 56" aria-hidden="true" focusable="false" key="icon1">
      <circle cx="28" cy="29" r="16.5" fill="none" stroke="currentColor" strokeWidth="2.3" />
      <path
        d="M31.4 17.5 21.8 31h6.3l-3.3 9.3 10-14.2h-6.2Z"
        fill="currentColor"
        stroke="none"
      />
      <circle cx="43.5" cy="14" r="2.6" fill="#f2a71b" />
      <circle cx="14" cy="41" r="1.9" fill="#f2a71b" />
      <circle cx="44.5" cy="33" r="1.4" fill="#f2a71b" />
    </svg>
  ),
  (
    <svg viewBox="0 0 56 56" aria-hidden="true" focusable="false" key="icon2">
      <path
        d="M28 47.5c7.6-8.5 12.4-15 12.4-21.1a12.4 12.4 0 1 0-24.8 0c0 6.1 4.8 12.6 12.4 21.1Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinejoin="round"
      />
      <circle cx="28" cy="26" r="4.4" fill="currentColor" />
      <circle cx="41" cy="12.5" r="2.1" fill="#f2a71b" />
      <circle cx="15" cy="16" r="1.5" fill="#f2a71b" />
      <circle cx="45" cy="28" r="1.5" fill="#f2a71b" />
    </svg>
  ),
  (
    <svg viewBox="0 0 56 56" aria-hidden="true" focusable="false" key="icon3">
      <path
        d="M28 11.5 43 17v11.6c0 8-6.2 14.3-15 17.9-8.8-3.6-15-9.9-15-17.9V17l15-5.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinejoin="round"
      />
      <circle cx="28" cy="25" r="3.2" fill="currentColor" />
      <path d="M28 28.2v5" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
      <circle cx="45" cy="12" r="2" fill="#f2a71b" />
      <circle cx="12" cy="38" r="1.6" fill="#f2a71b" />
    </svg>
  ),
  (
    <svg viewBox="0 0 56 56" aria-hidden="true" focusable="false" key="icon4">
      <path
        d="M15 32v-4a13 13 0 0 1 26 0v4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
      <rect
        x="12.5"
        y="29"
        width="8"
        height="12"
        rx="3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
      />
      <rect
        x="35.5"
        y="29"
        width="8"
        height="12"
        rx="3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
      />
      <path
        d="M39.5 41v2a3 3 0 0 1-3 3H31"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
      <circle cx="43.5" cy="13" r="2" fill="#f2a71b" />
      <circle cx="12" cy="17" r="1.5" fill="#f2a71b" />
    </svg>
  ),
];

export default function FeatureStrip({ dict }: { dict: Dictionary }) {
  const items = dict.featureStrip.items;
  return (
    <div className="feature-strip-wrap" data-reveal style={{ '--reveal-delay': '450ms' } as CSSProperties}>
      <ul className="feature-strip">
        {items.map((item, index) => (
          <li key={item.title} style={{ animation: `slideUp 0.7s ease forwards ${index * 120 + 550}ms`, opacity: 0 }}>
            <span className="strip-icon">{icons[index] || icons[0]}</span>
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
