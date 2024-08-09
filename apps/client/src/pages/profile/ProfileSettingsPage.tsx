import { StandaloneNavLink } from '@/components/nav/NavLinkItem';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { USER_PROFILE_LINK_COLLECTION } from '@/lib/constants/href';
import { useSignedInUser } from '@/lib/hooks/useSignedInUser';
import { Outlet } from 'react-router-dom';

export default function ProfileSettingsPage() {
  const user = useSignedInUser();

  return (
    <div className="flex flex-1 flex-col px-10 pt-20 sm:px-20">
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-3xl sm:text-4xl">Settings</h2>
          <p className="text-xl text-muted-foreground sm:text-2xl">
            Welcome, {user?.personalNames.join(' ')} {user?.familyName}!
          </p>
        </div>
        <Separator />
      </div>
      <div className="flex flex-1 flex-col gap-8 sm:flex-row">
        {/*
         * TODO:
         * Make this more responsive on very narrow screens
         */}
        <ul className="my-4 flex list-none flex-row justify-start gap-4 sm:my-10 sm:flex-1 sm:flex-col">
          {USER_PROFILE_LINK_COLLECTION.items.map(link => (
            <TooltipProvider key={link.title + link.href}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <li className="h-min">
                    <StandaloneNavLink
                      title={link.title}
                      to={link.href}
                      className="w-full"
                      titleAlign="start"
                      end={!link.hasChildren}
                    />
                  </li>
                </TooltipTrigger>
                <TooltipContent>{link.description}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </ul>
        <Separator orientation="vertical" className="hidden h-full sm:block" />
        <div className="flex-[3] sm:p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
