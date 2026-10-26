import { REGISTER_URL } from './links';

export default function QrPanel() {
  return (
    <div className="qr-card" data-reveal>
      <p className="qr-card-title">Scan the QR code to go to the form</p>
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
        <span className="qr-direct-fill">Go to the form directly</span>
      </a>
    </div>
  );
}
