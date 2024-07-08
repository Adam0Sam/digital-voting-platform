import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { NavLink } from 'react-router-dom';

export default function AppNavigation() {
  return (
    <NavigationMenu className="py-10">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink>
            <NavLink
              to="/proposals"
              className={({ isActive }) => navigationMenuTriggerStyle(isActive)}
            >
              Proposals
            </NavLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink>
            <NavLink
              to="/profile"
              className={({ isActive }) => navigationMenuTriggerStyle(isActive)}
            >
              Your Profile
            </NavLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
