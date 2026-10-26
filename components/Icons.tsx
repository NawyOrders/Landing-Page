export function ArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M4.5 12h14.2M12.8 6.2 18.7 12l-5.9 5.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckIcon({ disabled = false }: { disabled?: boolean }) {
  return (
    <span className={`check-icon${disabled ? ' is-disabled' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 22 22" focusable="false">
        <circle cx="11" cy="11" r="11" fill="currentColor" />
        <path
          d="m6.6 11.3 2.9 2.9 5.9-6.1"
          fill="none"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
