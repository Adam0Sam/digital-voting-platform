import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

import { CircleUserRound } from 'lucide-react';
import { proposalLinkCollection } from './link-collections';
import { NavLinkProps } from 'react-router-dom';

type getStyles = (isActive: boolean) => string;
// why do i get error when I pass arrow fn directly?
const getLinkItemStyles: getStyles = isActive =>
  cn(
    'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
    {
      'bg-accent/50': isActive,
      'text-accent-foreground': isActive,
    },
  );

const getStandaloneLinkStyles: getStyles = isActive =>
  cn(
    'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-6 py-4 xs:text-sm sm:text-md md:text-lg font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50',
    { 'bg-accent/50': isActive },
  );

export type LinkComponentProps = NavLinkProps & {
  children: React.ReactNode;
  className?: string;
};

const LinkItem = ({
  to,
  title,
  children,
  className,
  ...props
}: LinkComponentProps) => (
  <li>
    <NavLink
      className={({ isActive }) => cn(getLinkItemStyles(isActive), className)}
      to={to}
      end
      {...props}
    >
      <div className="text-sm font-medium leading-none">{title}</div>
      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
        {children}
      </p>
    </NavLink>
  </li>
);

LinkItem.displayName = 'LinkItem';

export default function DesktopNav({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-1 items-center justify-center', className)}>
      <NavigationMenu className="ml-auto">
        <NavigationMenuList className="gap-3">
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              {proposalLinkCollection.name}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-4">
                  <NavLink
                    className="flex h-full w-full select-none flex-col justify-center rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    to="/proposals"
                  >
                    <div className="mb-2 mt-4 flex items-center gap-2">
                      {proposalLinkCollection.icon && (
                        <proposalLinkCollection.icon />
                      )}
                      <p className="text-lg font-medium">
                        {proposalLinkCollection.name}
                      </p>
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      {proposalLinkCollection.description}
                    </p>
                  </NavLink>
                </li>
                {proposalLinkCollection.items.map(proposal => (
                  <LinkItem
                    key={proposal.title}
                    title={proposal.title}
                    to={proposal.href}
                  >
                    {proposal.description}
                  </LinkItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <NavigationMenuItem className="ml-auto mr-10 flex max-w-max items-center">
        <NavLink to="/me" end className={'self-end'}>
          <CircleUserRound />
        </NavLink>
      </NavigationMenuItem>
    </div>
  );
}
