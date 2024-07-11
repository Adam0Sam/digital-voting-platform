import { NavLink, type NavLinkProps } from 'react-router-dom';
import { cn } from '@/lib/utils';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

import { ClipboardPlus } from 'lucide-react';

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Alert Dialog',
    href: '/docs/primitives/alert-dialog',
    description:
      'A modal dialog that interrupts the user with important content and expects a response.',
  },
  {
    title: 'Hover Card',
    href: '/docs/primitives/hover-card',
    description:
      'For sighted users to preview content available behind a link.',
  },
  {
    title: 'Progress',
    href: '/docs/primitives/progress',
    description:
      'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
  },
  {
    title: 'Scroll-area',
    href: '/docs/primitives/scroll-area',
    description: 'Visually or semantically separates content.',
  },
  {
    title: 'Tabs',
    href: '/docs/primitives/tabs',
    description:
      'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
  },
  {
    title: 'dfsdf',
    href: '/docs/primitives/tooltip',
    description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
  },
  {
    title: 'dsfs-area',
    href: '/docs/primitives/scroll-area',
    description: 'Visually or semantically separates content.',
  },
  {
    title: 'dsfsfsdfdsf',
    href: '/docs/primitives/tabs',
    description:
      'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
  },
  {
    title: 'sdfsdfsdf',
    href: '/docs/primitives/tooltip',
    description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
  },
];

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

const getMenuLinkStyles: getStyles = isActive =>
  cn(
    'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-6 py-4 xs:text-sm sm:text-md md:text-lg font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50',
    { 'bg-accent/50': isActive },
  );

const LinkItem = ({
  to,
  title,
  children,
  ...props
}: NavLinkProps & { children: string }) => (
  <li>
    <NavLink
      className={({ isActive }) => getLinkItemStyles(isActive)}
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

interface LinkItemProps {
  title: string;
  href: string;
  description: string;
}

const proposalLinkItems: LinkItemProps[] = [
  {
    title: 'Active Proposals',
    href: '/proposals/active',
    description: 'Proposals that are currently being discussed.',
  },
  {
    title: 'Past Proposals',
    href: '/proposals/past',
    description: 'Proposals that have been accepted or rejected.',
  },
  {
    title: 'Create a Proposal',
    href: '/proposals/create',
    description: 'To put forward a change or elect a representative.',
  },
];

export default function AppNavigationMenu() {
  return (
    <NavigationMenu className="pt-6">
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
                  <div className="mb-2 mt-4 text-lg font-medium">Proposals</div>
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
              {components.map(component => (
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
        <NavigationMenuItem>
          <NavLink
            to="/docs"
            end
            className={({ isActive }) => getMenuLinkStyles(isActive)}
          >
            <NavigationMenuLink>Your Profile</NavigationMenuLink>
          </NavLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
