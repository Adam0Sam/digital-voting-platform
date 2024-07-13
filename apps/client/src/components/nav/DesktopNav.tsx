import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

import { CircleUserRound, ClipboardPlus } from 'lucide-react';
import { componentLinkItems, proposalLinkItems } from './links';
import { LinkItemProps } from './interfaces';

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

const LinkItem = ({
  to,
  title,
  children,
  className,
  ...props
}: LinkItemProps) => (
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
            <NavigationMenuTrigger>Proposals</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavLink
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    to="/proposals"
                  >
                    <ClipboardPlus className="h-6 w-6" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Proposals
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Proposals are a way to suggest changes to a project, to
                      elect a representative and more. Here you can view, vote,
                      comment on proposals and even create your own!.
                    </p>
                  </NavLink>
                </li>
                {proposalLinkItems.map(proposal => (
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
          <NavigationMenuItem>
            <NavigationMenuTrigger>Components</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {componentLinkItems.map(component => (
                  <LinkItem
                    key={component.title}
                    title={component.title}
                    to={component.href}
                  >
                    {component.description}
                  </LinkItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <NavigationMenuItem className="ml-auto mr-10 flex max-w-max items-center">
        <NavLink to="/profile" end className={'self-end'}>
          <CircleUserRound />
        </NavLink>
      </NavigationMenuItem>
    </div>
  );
}
