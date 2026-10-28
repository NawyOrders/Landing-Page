import { REGISTER_URL } from './links';
import type { Dictionary } from '@/lib/i18n/dictionary';

export default function QrPanel({ dict }: { dict?: Dictionary } = {}) {
  return (
    <div className="qr-card" data-reveal>
      <p className="qr-card-title">{dict?.qrCta.cardTitle || 'Scan the QR code to go to the form'}</p>
      <div className="qr-box">
        <img
          className="qr-svg"
          src="/images/register-qr.svg"
          width="276"
          height="276"
          alt="QR code that opens the Nawy Orders registration form"
        />
      </div>
      <a className="qr-direct" href={REGISTER_URL}>
        <span className="qr-direct-fill">{dict?.qrCta.button || 'Go to the form directly'}</span>
      </a>
    </div>
  );
}
