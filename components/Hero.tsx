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
        <img
          className="hero-decoration hero-decoration--top-start"
          src="/images/hero/topleften-cutout.webp"
          width="1053"
          height="805"
          alt=""
          aria-hidden="true"
        />
        <img
          className="hero-decoration hero-decoration--top-end"
          src="/images/hero/toprighten-cutout.webp"
          width="2181"
          height="934"
          alt=""
          aria-hidden="true"
        />
        <img
          className="hero-fries"
          src="/images/hero/fries-cutout.webp"
          width="605"
          height="483"
          alt=""
          aria-hidden="true"
        />

        <div className="hero-inner">
          <div className="hero-copy">
            <span className="chip chip--shine hero-badge" data-reveal="flip" style={revealStyle('50ms')}>{dict.hero.badge}</span>
            <h1 className="hero-title" data-reveal style={revealStyle('150ms')}>
              <span className="hero-title-line">
                {dict.hero.title1}
                <img
                  className="hero-spark hero-spark--title"
                  src="/images/spark-burst.png"
                  width="60"
                  height="73"
                  alt=""
                  aria-hidden="true"
                />
              </span>
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
          <img
            className="hero-devices"
            src="/images/hero/platewithdevices-cutout.webp"
            width="3465"
            height="2530"
            alt={dict.hero.imageAlt}
            fetchPriority="high"
          />
        </div>
      </div>

      <FeatureStrip dict={dict} />
    </section>
  );
}
