import type { CSSProperties, ReactNode } from 'react';
import { ArrowIcon } from './Icons';
import FeatureStrip from './FeatureStrip';
import type { Dictionary } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n';

type RevealStyle = CSSProperties & { '--reveal-delay': string };

const revealStyle = (delay: string): RevealStyle => ({ '--reveal-delay': delay });

function HeroText({ text, locale }: { text: string; locale: Locale }): ReactNode {
  if (locale !== 'ar') return text;

  const match = /^(.*?)([،,—–]\s*\S+)([\s\S]*)$/.exec(text);
  if (!match) return text;

  return (
    <>
      {match[1]}
      <span className="hero-nowrap">{match[2]}</span>
      {match[3]}
    </>
  );
}

export default function Hero({ dict, locale }: { dict: Dictionary; locale: Locale }) {
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
            <span className="chip chip--shine hero-badge" data-reveal="flip" style={revealStyle('50ms')}>{dict.hero.badge}</span>
            <h1 className="hero-title" data-reveal style={revealStyle('150ms')}>
              <span>{dict.hero.title1}</span>
              <span>{dict.hero.title2}</span>
              <em>
                {dict.hero.title3}{' '}
                <span className="hero-title-em">{dict.hero.title3Em}</span>
              </em>
            </h1>
            <p className="hero-text" data-reveal style={revealStyle('250ms')}>
              <HeroText text={dict.hero.text} locale={locale} />
            </p>
            <div className="hero-cta-wrap" data-reveal style={revealStyle('350ms')}>
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
              <a className="btn btn--primary hero-cta" href="#features" style={{ animation: 'pulseGentle 2s ease-in-out infinite' }}>
                {dict.hero.cta}
                <ArrowIcon className="hero-cta-arrow" />
              </a>
            </div>
          </div>
        </div>

        <div className="hero-visual" data-reveal="zoom" style={revealStyle('200ms')}>
          <img
            src="/images/hero-visual.jpg"
            width="792"
            height="759"
            alt={dict.hero.imageAlt}
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
        />
      </div>

      <FeatureStrip dict={dict} />
    </section>
  );
}
