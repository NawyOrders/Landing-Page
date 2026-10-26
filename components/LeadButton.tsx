'use client';

import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { useUi } from './UiProvider';

type LeadButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  className?: string;
};

export default function LeadButton({ children, className = 'btn btn--primary', onClick, ...rest }: LeadButtonProps) {
  const { openLead } = useUi();

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (onClick) onClick(event);
    openLead();
  }

  return (
    <button type="button" className={className} onClick={handleClick} {...rest}>
      {children}
    </button>
  );
}
