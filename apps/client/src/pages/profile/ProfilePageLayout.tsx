import { StandaloneNavLink } from '@/components/nav/NavLinkItem';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSignedInUser } from '@/lib/hooks/useSignedInUser';
import { USER_PROFILE_LINK_COLLECTION } from '@/lib/href';
import { Outlet } from 'react-router-dom';

export default function ProfilePageLayout() {
  const { user } = useSignedInUser();

  return (
    <div className="flex flex-1 flex-col px-10 pt-20 md:px-20">
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-3xl md:text-4xl">Settings</h2>
          <p className="text-xl text-muted-foreground md:text-2xl">
            Welcome, {user?.personalNames.join(' ')} {user?.familyName}!
          </p>
        </div>
        <Separator />
      </div>
      <div className="flex flex-1 flex-col gap-8 md:flex-row">
        {/*
         * TODO:
         * Make this more responsive on very narrow screens
         */}
        <ul className="my-4 flex list-none flex-row justify-start gap-4 md:my-10 md:flex-1 md:flex-col">
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
        <Separator orientation="vertical" className="hidden h-full md:block" />
        <div className="flex-[4] md:p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
