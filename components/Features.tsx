import type { CSSProperties } from 'react';

const iconProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const features = [
  {
    title: 'Zero Commission',
    text: 'Orders reach you in full, with no commission or percentage taken from your profits.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...iconProps}>
        <path d="M12 3.6l1.6 1.7 2.3-.5.7 2.3 2.3.7-.5 2.3L20.4 12l-1.7 1.6.5 2.3-2.3.7-.7 2.3-2.3-.5L12 20.4l-1.6-1.7-2.3.5-.7-2.3-2.3-.7.5-2.3L3.6 12l1.7-1.6-.5-2.3 2.3-.7.7-2.3 2.3.5Z" />
        <path d="M9 15l6-6" />
        <circle cx="9.4" cy="9.3" r=".9" fill="currentColor" stroke="none" />
        <circle cx="14.6" cy="14.7" r=".9" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: 'Online Orders',
    text: 'Receive orders directly on the app without an intermediary.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...iconProps}>
        <path d="M5.4 8.7h13.2l-1 10a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.8Z" />
        <path d="M9 8.6V6.8a3 3 0 0 1 6 0v1.8" />
        <circle cx="9.4" cy="12.6" r=".8" fill="currentColor" stroke="none" />
        <circle cx="14.6" cy="12.6" r=".8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: 'Coupons and Discounts',
    text: "Activate offers and discount coupons to increase your customers' loyalty.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...iconProps}>
        <path d="M4.2 7.6h15.6v3.1a2.4 2.4 0 0 0 0 4.6v3.1H4.2v-3.1a2.4 2.4 0 0 0 0-4.6V7.6Z" />
        <path d="M13.6 9.1v6.8" strokeDasharray="1.7 1.9" />
        <path d="M8 14.6l3.2-3.4" />
        <circle cx="8.1" cy="10.4" r=".8" fill="currentColor" stroke="none" />
        <circle cx="11" cy="13.9" r=".8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: 'Your Own Website',
    text: "An online ordering website with your menu and your restaurant's name.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...iconProps}>
        <rect x="3.8" y="4.8" width="16.4" height="14.4" rx="2.2" />
        <path d="M3.8 8.9h16.4" />
        <circle cx="6.7" cy="6.9" r=".55" fill="currentColor" stroke="none" />
        <circle cx="8.8" cy="6.9" r=".55" fill="currentColor" stroke="none" />
        <path d="M7.5 12.2h5.2M7.5 15.4h7.9" />
        <path d="M15.6 11.6h1.2v1.2" />
      </svg>
    ),
  },
  {
    title: 'Smart Dashboard',
    text: 'Track orders, sales, and the menu from one simple dashboard.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...iconProps}>
        <path d="M4.2 16.7a8.4 8.4 0 1 1 15.6 0" />
        <path d="M12 14.4l3.2-3.4" />
        <circle cx="12" cy="15" r="1.5" fill="currentColor" stroke="none" />
        <path d="M6.2 13.2h2.2M15.6 13.2h2.2M12 8.4v1.8" />
      </svg>
    ),
  },
  {
    title: "Your Customers' Data",
    text: 'Know your customers and make them prefer you with discounts and offers.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...iconProps}>
        <circle cx="9.4" cy="8.7" r="2.9" />
        <path d="M4.5 18.2c.6-3.1 2.5-4.8 4.9-4.8 1.2 0 2.2.4 3 1.2" />
        <path d="M16.1 11.8v6.5M14 15.1h4.2" />
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section id="features" className="features-section">
      <div className="container">
        <header className="features-head" data-reveal>
          <img
            className="flank flank--burger"
            src="/images/burger.jpg"
            width="200"
            height="250"
            alt=""
            aria-hidden="true"
            loading="lazy"
          />
          <img
            className="flank flank--fries"
            src="/images/fries.jpg"
            width="170"
            height="250"
            alt=""
            aria-hidden="true"
            loading="lazy"
          />
          <h2 className="section-title">
            Everything your restaurant needs{' '}
            <br />
            in one app
          </h2>
          <p className="section-sub">
            Integrated features that help you manage your restaurant and{' '}
            <br />
            increase your sales
          </p>
        </header>

        <ul className="features-grid">
          {features.map((feature, index) => (
            <li
              key={feature.title}
              className="feature-card"
              data-reveal
              style={{ '--reveal-delay': `${(index % 3) * 100 + Math.floor(index/3)*150}ms` } as CSSProperties}
            >
              <div className="feature-card-head">
                <span className="feature-icon">{feature.icon}</span>
                <h3>{feature.title}</h3>
              </div>
              <p>{feature.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
