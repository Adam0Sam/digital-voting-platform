import { NavLinkProps } from 'react-router-dom';

export interface LinkItemProps extends NavLinkProps {
  children: React.ReactNode;
  className?: string;
}
