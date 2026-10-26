import type { CSSProperties } from 'react';
import RegisterLink from './RegisterLink';

export default function DarkCta() {
  return (
    <section className="dark-cta torn-top torn-bottom">
      <div className="container dark-grid">
        <div className="dark-visual" data-reveal>
          <img
            src="/images/dark-visual.jpg"
            width="710"
            height="685"
            alt="A phone playing the Nawy Orders brand with a giant burger bursting out of the screen"
            loading="lazy"
          />
        </div>
        <div
          className="dark-copy"
          data-reveal
          style={{ '--reveal-delay': '120ms' } as CSSProperties}
        >
          <h2>More Orders, Lower Costs.</h2>
          <p>Take your restaurant digital and easily double your profits.</p>
          <RegisterLink className="btn btn--primary">Start Now</RegisterLink>
        </div>
      </div>
    </section>
  );
}
