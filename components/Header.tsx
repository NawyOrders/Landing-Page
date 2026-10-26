'use client';

import { useEffect, useState } from 'react';
import LogoMark from './LogoMark';
import LeadButton from './LeadButton';
import { ArrowIcon } from './Icons';
import { useUi } from './UiProvider';

const navLinks = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'features', label: 'Features', href: '#features' },
  { id: 'how-to-join', label: 'How to join', href: '#how-to-join' },
  { id: 'pricing', label: 'Plans', href: '#pricing' },
];

export default function Header() {
  const { openFaq } = useUi();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [active, setActive] = useState<string>('home');
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    function updateActive() {
      setScrolled(window.scrollY > 8);
      const offset = 160;
      let current = 'home';
      navLinks.forEach(({ id }) => {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= offset) current = id;
      });
      setActive(current);
    }

    updateActive();
    window.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('resize', updateActive);
    return () => {
      window.removeEventListener('scroll', updateActive);
      window.removeEventListener('resize', updateActive);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  function handleFaq() {
    setMenuOpen(false);
    openFaq();
  }

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="header-inner">
        <a className="header-brand" href="#home" aria-label="Nawy Orders — home">
          <LogoMark />
        </a>

        <nav className="main-nav" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`nav-link${active === link.id ? ' is-active' : ''}`}
            >
              {link.label}
            </a>
          ))}
          <button type="button" className="nav-link nav-link--button" onClick={handleFaq}>
            FAQ
          </button>
        </nav>

        <div className="header-actions">
          <LeadButton className="btn btn--primary header-cta">
            Get Started
            <ArrowIcon />
          </LeadButton>
          <button
            type="button"
            className={`menu-toggle${menuOpen ? ' is-open' : ''}`}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-menu" id="mobile-menu">
          <nav aria-label="Mobile">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className={`mobile-link${active === link.id ? ' is-active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <button type="button" className="mobile-link mobile-link--button" onClick={handleFaq}>
              FAQ
            </button>
          </nav>
          <LeadButton
            className="btn btn--primary mobile-cta"
            onClick={() => setMenuOpen(false)}
          >
            Get Started
            <ArrowIcon />
          </LeadButton>
        </div>
      )}
    </header>
  );
}
