import { cn } from '@/lib/utils';
import { StandaloneNavLink } from './NavLinkItem';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export type Link = {
  title: string;
  href: string;
};
type InnerPageNavLinksProps = {
  links: Link[];
  forceFirstActive?: boolean;
};
export default function InnerPageNavLinks({
  links,
  forceFirstActive,
}: InnerPageNavLinksProps) {
  const navigate = useNavigate();
  useEffect(() => {
    if (forceFirstActive) {
      navigate(links[0].href);
    }
  }, [forceFirstActive, links, navigate]);

  return (
    <div className="flex max-w-max rounded-md border-2 border-secondary">
      {links.map(({ title, href }, index) => (
        <StandaloneNavLink
          key={title}
          to={href}
          title={title}
          titleAlign="center"
          titleClassName="text-md"
          className={cn('min-w-0 flex-1 rounded-none px-6 py-6', {
            'rounded-l-md': index === 0,
            'rounded-r-md': index === links.length - 1,
          })}
        />
      ))}
    </div>
  );
}
