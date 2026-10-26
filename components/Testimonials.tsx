import type { CSSProperties } from 'react';

const testimonials = [
  {
    name: 'Khaled Lamri',
    place: 'Burger kings',
    avatar: '/images/avatar-khaled.jpg',
    quote:
      'Inventory reports saved us a lot of waste. My team learned the system in one day. Highly professional technical support.',
  },
  {
    name: 'Sara El-Khatib',
    place: "Al-Sa'ada Cafe",
    avatar: '/images/avatar-sara.jpg',
    quote:
      'Orders now reach the kitchen in seconds . Customers noticed the difference from the first week. The best decision I made is Nawy Orders.',
  },
  {
    name: 'Ahmed El-Masry',
    place: 'Pie & Honey Restaurant',
    avatar: '/images/avatar-ahmed.jpg',
    quote:
      'waste hours every day on calculations. Now everything is in front of me on one screen. And sales increased by 30% in the first two months.',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="testimonials-section">
      <svg className="testi-clip-svg" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="testi-clip-1" clipPathUnits="objectBoundingBox">
            <path d="M0.05728 0L0.93854 0Q0.99582 0 0.98623 0.08829L0.89671 0.91171Q0.88711 1 0.82983 1L0.05728 1Q0 1 0 0.91045L0 0.08955Q0 0 0.05728 0Z" />
          </clipPath>
          <clipPath id="testi-clip-2" clipPathUnits="objectBoundingBox">
            <path d="M0.16264 0L0.83966 0Q0.89483 0 0.90407 0.08829L0.99030 0.91171Q0.99954 1 0.94437 1L0.05793 1Q0.00276 1 0.01200 0.91171L0.09823 0.08829Q0.10747 0 0.16264 0Z" />
          </clipPath>
          <clipPath id="testi-clip-3" clipPathUnits="objectBoundingBox">
            <path d="M0.06146 0L0.94272 0Q1 0 1 0.08955L1 0.91045Q1 1 0.94272 1L0.12248 1Q0.11289 1 0.12248 0.91171L0.01377 0.08829Q0.00418 0 0.06146 0Z" />
          </clipPath>
        </defs>
      </svg>
      <img
        className="testi-noodles"
        src="/images/noodles.jpg"
        width="200"
        height="208"
        alt=""
        aria-hidden="true"
        loading="lazy"
      />
      <div className="container">
        <header className="testimonials-head" data-reveal>
          <h2 className="section-title">
            What they say <span className="accent">about us</span>
          </h2>
          <p className="section-sub">
            Real success stories from restaurants using Nawy Orders
          </p>
        </header>

        <div className="testimonials-grid">
          {testimonials.map((item, index) => (
            <article
              key={item.name}
              className={`testimonial-card${item.place === 'Burger kings' ? ' testimonial-card--float' : ''}`}
              data-reveal
              style={{ '--reveal-delay': `${index * 90}ms` } as CSSProperties}
            >
              <div className="testimonial-inner">
                <img
                  className="testimonial-avatar"
                  src={item.avatar}
                  width="80"
                  height="80"
                  alt={`Portrait of ${item.name}`}
                  loading="lazy"
                />
                <h3>{item.name}</h3>
                {item.place ? (
                  <p
                    className={`testimonial-place${item.place === 'Burger kings' ? ' testi-place-float' : ''}`}
                  >
                    {item.place}
                  </p>
                ) : null}
                <blockquote>{item.quote}</blockquote>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
