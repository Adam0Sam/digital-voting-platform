import { NavLinkProps } from 'react-router-dom';

export interface LinkComponentProps extends NavLinkProps {
  children: React.ReactNode;
  className?: string;
}
