import type { CSSProperties } from 'react';
import QrPanel from './QrPanel';
import type { Dictionary } from '@/lib/i18n/dictionary';

export default function QrCta({ dict }: { dict?: Dictionary } = {}) {
  return (
    <section id="get-started" className="qr-section">
      <img
        className="qr-plate"
        src="/images/salmon-plate.jpg"
        width="300"
        height="340"
        alt=""
        aria-hidden="true"
        loading="lazy"
      />
      <div className="container">
        <header className="qr-head" data-reveal style={{ '--reveal-delay': '50ms' } as CSSProperties}>
          <h2 className="section-title">
            <span className="accent">{dict?.qrCta.title1?.split(' ')[0] || 'Start'}</span> {(dict?.qrCta.title1 || 'Start your journey today with').replace(dict?.qrCta.title1?.split(' ')[0] || 'Start', '').trim() || 'your journey today with'}{' '}
            <span className="accent">{dict?.qrCta.title2 || 'Nawy Orders'}</span>
          </h2>
          <p className="section-sub">
            {(dict?.qrCta.subtitle1 || 'Register your details and our team will contact your restaurant within')}{' '}
            <span className="accent">{dict?.qrCta.subtitle2 || '48 hours.'}</span>
          </p>
        </header>
        <div data-reveal style={{ '--reveal-delay': '200ms' } as CSSProperties}>
          <QrPanel dict={dict} />
        </div>
      </div>
    </section>
  );
}
