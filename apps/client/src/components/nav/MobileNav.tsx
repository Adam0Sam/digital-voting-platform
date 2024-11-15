import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CircleUserRound, Menu, Settings } from 'lucide-react';
import { PROPOSAL_LINK_COLLECTION } from '../../lib/href/proposal.links';
import { USER_PROFILE_HREFS, ADMIN_HREFS } from '@/lib/routes';
import { useSignedInUser } from '@/lib/hooks/useSignedInUser';
import { UserRole } from '@ambassador/user';

export default function MobileNav({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSignedInUser();
  const isAdmin = user?.roles.includes(UserRole.ADMIN);

  return (
    <div className={cn('flex items-center justify-between px-4', className)}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Menu</h2>
          </div>
          <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
            <div className="flex flex-col space-y-3">
              <h3 className="mb-2 font-semibold">
                {PROPOSAL_LINK_COLLECTION.name}
              </h3>
              {PROPOSAL_LINK_COLLECTION.items.map(item => (
                <NavLink
                  key={item.title}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'text-sm font-medium transition-colors hover:text-primary',
                      isActive ? 'text-primary' : 'text-muted-foreground',
                    )
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {item.title}
                </NavLink>
              ))}
              {isAdmin && (
                <NavLink
                  to={ADMIN_HREFS.BASE}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center text-sm font-medium transition-colors hover:text-primary',
                      isActive ? 'text-primary' : 'text-muted-foreground',
                    )
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Admin
                </NavLink>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <NavLink to="/" className="flex items-center space-x-2">
        <span className="font-bold">Your App Name</span>
      </NavLink>

      <NavLink
        to={USER_PROFILE_HREFS.BASE}
        end
        className={({ isActive }) =>
          cn(
            'flex items-center rounded-full p-2',
            isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
          )
        }
      >
        <CircleUserRound className="h-6 w-6" />
      </NavLink>
    </div>
  );
}
