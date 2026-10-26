import { type AnchorHTMLAttributes, type ReactNode } from 'react';
import { REGISTER_URL } from './links';

type RegisterLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  children: ReactNode;
  className?: string;
  href?: string;
};

export default function RegisterLink({
  children,
  className = 'btn btn--primary',
  href = REGISTER_URL,
  ...rest
}: RegisterLinkProps) {
  return (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  );
}
