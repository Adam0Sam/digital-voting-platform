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

import { CircleUserRound } from 'lucide-react';
import { PROPOSAL_LINK_COLLECTION } from '../../lib/href/proposal.links';

import { NavLinkItem, StandaloneNavLink } from './NavLinkItem';
import { USER_PROFILE_HREFS, ADMIN_HREFS } from '@/lib/routes';
import { useSignedInUser } from '@/lib/hooks/useSignedInUser';
import { UserRole } from '@ambassador';
import NotificationBell from '../notification/NotificationBell';

export default function DesktopNav({ className }: { className?: string }) {
  const { user } = useSignedInUser();
  const isAdmin = user?.roles.includes(UserRole.ADMIN);

  return (
    <div className={cn('flex flex-1 items-center justify-center', className)}>
      <NavigationMenu className="ml-auto">
        <NavigationMenuList className="gap-3">
          <NavigationMenuItem>
            <NavigationMenuTrigger onClick={e => e.preventDefault()}>
              {PROPOSAL_LINK_COLLECTION.name}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-4">
                  <NavLink
                    className="flex h-full w-full select-none flex-col justify-center rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    to="/proposals"
                  >
                    <div className="mb-2 mt-4 flex items-center gap-2">
                      {PROPOSAL_LINK_COLLECTION.icon && (
                        <PROPOSAL_LINK_COLLECTION.icon />
                      )}
                      <p className="text-lg font-medium">
                        {PROPOSAL_LINK_COLLECTION.name}
                      </p>
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      {PROPOSAL_LINK_COLLECTION.description}
                    </p>
                  </NavLink>
                </li>
                {PROPOSAL_LINK_COLLECTION.items.map(proposal => (
                  <NavLinkItem
                    key={proposal.title}
                    title={proposal.title}
                    to={proposal.href}
                  >
                    {proposal.description}
                  </NavLinkItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          {isAdmin && (
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <StandaloneNavLink
                  to={ADMIN_HREFS.BASE}
                  title="Admin"
                  titleClassName="text-lg px-2"
                  end={false}
                ></StandaloneNavLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
      <NavigationMenuItem className="ml-auto mr-10 flex max-w-max items-center gap-2">
        <NotificationBell />
        <NavLink
          to={USER_PROFILE_HREFS.BASE}
          end
          className={({ isActive }) =>
            cn(
              'flex items-center rounded-full p-2',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted',
            )
          }
        >
          <CircleUserRound className="h-6 w-6" />
        </NavLink>
      </NavigationMenuItem>
    </div>
  );
}
