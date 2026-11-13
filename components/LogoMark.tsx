export default function LogoMark({ className = '' }: { className?: string }) {
  return (
    <span className={`logo-mark ${className}`} aria-hidden="true">
      <img src="/icons/icon.svg" width="142" height="143" alt="" />
    </span>
  );
}
