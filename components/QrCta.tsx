import QrPanel from './QrPanel';

export default function QrCta() {
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
        <header className="qr-head" data-reveal>
          <h2 className="section-title">
            <span className="accent">Start</span> your journey today with{' '}
            <span className="accent">Nawy Orders</span>
          </h2>
          <p className="section-sub">
            Register your details and our team will contact your restaurant within{' '}
            <span className="accent">48 hours.</span>
          </p>
        </header>
        <QrPanel />
      </div>
    </section>
  );
}
