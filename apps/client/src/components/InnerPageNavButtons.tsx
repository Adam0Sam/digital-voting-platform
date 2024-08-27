import { cn } from '@/lib/utils';
import { StandaloneNavLink } from './nav/NavLinkItem';

type InnerPageNavButtonsProps = {
  hrefEntries: Record<string, string>;
  className?: string;
};

export default function InnerPageNavButtons({
  hrefEntries,
  className,
}: InnerPageNavButtonsProps) {
  const entryLength = Object.keys(hrefEntries).length;

  return (
    <div
      className={cn(
        'flex max-w-max rounded-md border-2 border-secondary',
        className,
      )}
    >
      {Object.entries(hrefEntries).map(([title, href], index) => (
        <StandaloneNavLink
          key={title}
          to={href}
          title={title}
          titleAlign="center"
          titleClassName="text-md"
          className={cn('min-w-0 flex-1 rounded-none px-6 py-6', {
            'rounded-l-md': index === 0,
            'rounded-r-md': index === entryLength - 1,
          })}
        />
      ))}
    </div>
  );
}
