import { ArrowIcon } from './Icons';
import FeatureStrip from './FeatureStrip';

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-card">
        <svg
          className="hero-blob"
          viewBox="0 0 720 440"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="#fbb615"
            d="M0 0h565c-38 54-83 96-146 130-56 30-117 42-165 82-55 46-81 103-136 142L0 420Z"
          />
          <path
            fill="#f83f2a"
            d="M0 0h445c-42 44-87 79-145 104-48 21-104 27-149 55-55 34-88 78-151 105V0Z"
          />
          <path
            fill="#fb5a16"
            d="M0 0h268c-25 31-59 54-99 70-47 19-100 27-134 61-14 14-25 30-35 47V0Z"
          />
        </svg>

        <div className="hero-inner">
          <div className="hero-copy">
            <span className="chip chip--shine hero-badge" data-reveal="scale" style={{ '--reveal-delay': '50ms' } as any}>Smart Restaurant Management</span>
            <h1 className="hero-title" data-reveal style={{ '--reveal-delay': '150ms' } as any}>
              <span>Your Restaurant.</span>
              <span>Your Orders</span>
              <em>All in One Place</em>
            </h1>
            <p className="hero-text" data-reveal style={{ '--reveal-delay': '250ms' } as any}>
              Manage orders, simplify daily operations, and deliver a better customer experience
              &nbsp;all from one powerful platform.
            </p>
            <div className="hero-cta-wrap" data-reveal style={{ '--reveal-delay': '350ms' } as any}>
              <img
                className="hero-spark hero-spark--cta"
                src="/images/spark-burst.png"
                width="60"
                height="73"
                alt=""
                aria-hidden="true"
              />
              <img
                className="hero-spark hero-spark--cta-left"
                src="/images/spark-burst-left.png"
                width="60"
                height="74"
                alt=""
                aria-hidden="true"
              />
              <a className="btn btn--primary hero-cta" href="#features">
                Explore Nawy Orders
                <ArrowIcon />
              </a>
            </div>
          </div>
        </div>

        <div className="hero-visual" data-reveal="right" style={{ '--reveal-delay': '200ms' } as any}>
          <img
            src="/images/hero-visual.jpg"
            width="792"
            height="759"
            alt="Nawy Orders app on a phone and laptop, displayed on a wooden board with a burger and a soft drink"
            fetchPriority="high"
          />
        </div>

        <img
          className="hero-fries"
          src="/images/hero-fries.jpg"
          width="190"
          height="158"
          alt=""
          aria-hidden="true"
          style={{ animation: 'float 3s ease-in-out infinite' } as any}
        />
      </div>

      <FeatureStrip />
    </section>
  );
}
