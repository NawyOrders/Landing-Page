import LogoMark from './LogoMark';

const columns = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#home' },
      { label: 'Our Team', href: '#testimonials' },
      { label: 'Careers', href: '#how-to-join' },
      { label: 'Contact Us', href: '#get-started' },
    ],
  },
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Templates', href: '#brand' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#home' },
      { label: 'Terms and Conditions', href: '#home' },
      { label: 'Refund Policy', href: '#home' },
    ],
  },
];

const socials = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com',
    path: 'M6.94 8.5H3.56V19.5h3.38V8.5ZM5.25 3.5a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM20.44 13.4c0-3.16-1.69-4.63-3.94-4.63a3.4 3.4 0 0 0-3.08 1.7h-.05V8.5H10.1v11h3.37v-5.45c0-1.44.27-2.83 2.05-2.83 1.75 0 1.78 1.64 1.78 2.92v5.36h3.37V13.4Z',
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com',
    path: 'M20.9 6.9c-.65.29-1.34.48-2.06.57a3.6 3.6 0 0 0 1.58-1.98 7.2 7.2 0 0 1-2.28.87 3.59 3.59 0 0 0-6.11 3.27A10.18 10.18 0 0 1 4.63 5.9a3.59 3.59 0 0 0 1.11 4.79 3.56 3.56 0 0 1-1.63-.45v.05a3.59 3.59 0 0 0 2.88 3.52 3.62 3.62 0 0 1-1.62.06 3.6 3.6 0 0 0 3.35 2.49A7.2 7.2 0 0 1 3.4 18a10.15 10.15 0 0 0 5.5 1.61c6.6 0 10.2-5.46 10.2-10.2l-.01-.46a7.3 7.3 0 0 0 1.81-1.85Z',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com',
    path: 'M12 7.8a4.2 4.2 0 1 0 0 8.4 4.2 4.2 0 0 0 0-8.4Zm0 6.93a2.73 2.73 0 1 1 0-5.46 2.73 2.73 0 0 1 0 5.46Zm5.35-7.1a.98.98 0 1 1-1.96 0 .98.98 0 0 1 1.96 0ZM20.7 8.7c-.06-1.32-.36-2.49-1.33-3.46-.97-.97-2.14-1.27-3.46-1.33C14.55 3.83 9.45 3.83 8.1 3.9c-1.32.06-2.48.36-3.46 1.33-.97.97-1.27 2.14-1.33 3.46-.08 1.36-.08 6.46 0 7.81.06 1.32.36 2.49 1.33 3.46.98.97 2.14 1.27 3.46 1.33 1.36.08 6.46.08 7.81 0 1.32-.06 2.49-.36 3.46-1.33.97-.97 1.27-2.14 1.33-3.46.08-1.35.08-6.45 0-7.8Zm-1.92 9.28a2.77 2.77 0 0 1-1.56 1.56c-1.08.43-3.64.33-4.83.33-1.2 0-3.75.09-4.83-.33a2.78 2.78 0 0 1-1.56-1.56c-.43-1.08-.33-3.64-.33-4.84 0-1.2-.1-3.75.33-4.83A2.77 2.77 0 0 1 7.56 6.75c1.08-.43 3.64-.33 4.83-.33 1.2 0 3.75-.1 4.83.33.72.29 1.28.85 1.56 1.56.43 1.08.33 3.64.33 4.83 0 1.2.1 3.76-.33 4.84Z',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com',
    path: 'M13.6 20.5v-7.4h2.48l.37-2.88H13.6V8.38c0-.83.23-1.4 1.43-1.4h1.53V4.4a20.6 20.6 0 0 0-2.23-.11c-2.2 0-3.7 1.34-3.7 3.8v2.13H8.14v2.88h2.5v7.4h2.96Z',
  },
];

export default function Footer() {
  return (
    <footer className="site-footer torn-top">
      <div className="footer-watermark-clip" aria-hidden="true">
        <div className="footer-watermark">Nawy Orders</div>
      </div>

      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <LogoMark />
              <span>Nawy Orders</span>
            </div>
            <p>
              A platform that helps restaurant owners build their own applications with their visual
              identity easily and quickly.
            </p>
          </div>

          {columns.map((column) => (
            <nav key={column.title} className="footer-col" aria-label={column.title}>
              <h3>{column.title}</h3>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="footer-bottom">
          <p>
            © 2026 Nawy Orders. All rights reserved to <span className="spacetech">SpaceTech</span>.
          </p>
          <ul className="footer-socials">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={social.label}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d={social.path} fill="currentColor" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
