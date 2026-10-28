import type { CSSProperties } from 'react';
import RegisterLink from './RegisterLink';
import type { Dictionary } from '@/lib/i18n/dictionary';

export default function DarkCta({ dict }: { dict?: Dictionary } = {}) {
  return (
    <section className="dark-cta torn-top torn-bottom">
      <div className="container dark-grid">
        <div className="dark-visual" data-reveal="left" style={{ '--reveal-delay': '50ms' } as CSSProperties}>
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
          data-reveal="right"
          style={{ '--reveal-delay': '150ms' } as CSSProperties}
        >
          <h2>{dict?.darkCta.title || 'More Orders, Lower Costs.'}</h2>
          <p>{dict?.darkCta.subtitle || 'Take your restaurant digital and easily double your profits.'}</p>
          <RegisterLink className="btn btn--primary" style={{ animation: 'pulseGentle 2.5s ease-in-out infinite' }}>{dict?.darkCta.cta || 'Start Now'}</RegisterLink>
        </div>
      </div>
    </section>
  );
}
