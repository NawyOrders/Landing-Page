export default function LogoMark({ className = '' }: { className?: string }) {
  return (
    <span className={`logo-mark ${className}`} aria-hidden="true">
      <svg viewBox="0 0 48 48" focusable="false">
        <defs>
          <linearGradient id="logoRed" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f04a2b" />
            <stop offset="1" stopColor="#dd301a" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="46" height="46" rx="11" fill="url(#logoRed)" />
        <path
          d="M14 27.5c2.1 5.4 5.8 8 10.1 8s8-2.6 10.1-8"
          fill="none"
          stroke="#fff"
          strokeWidth="3.1"
          strokeLinecap="round"
        />
        <path
          d="M26.4 20.4c-2.9-2.3-2.7-4.7.2-7.1 1.7-1.4 2.5-2.9 2.3-4.6.9 1.5 1.7 3.2 1.7 4.7 0 2.1-1.2 3.3-2.8 4.1-1.7.8-2.2 1.8-1.4 2.9"
          fill="none"
          stroke="#fff"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
