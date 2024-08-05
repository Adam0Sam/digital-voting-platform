import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { FC } from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CircleUserRound } from 'lucide-react';
import {
  PROPOSAL_LINK_COLLECTION,
  USER_PROFILE_PATHS,
  type LinkCollection,
} from '@/lib/constants/href';
const LinkCollection: FC<{
  collection: LinkCollection;
  handleOpen: () => void;
}> = ({ collection, handleOpen }) => {
  return (
    <div>
      <NavLink to={collection.basePath} className="text-lg font-bold">
        <div className="flex">
          {collection.name}
          {collection.icon && <collection.icon className="h-6 w-6" />}
        </div>
      </NavLink>
      <div className="flex flex-col">
        {collection.items.map(
          item =>
            item.href && (
              <NavLink to={item.href} key={item.href} onClick={handleOpen}>
                {item.title}
              </NavLink>
            ),
        )}
      </div>
    </div>
  );
};

function MobileBurgerSvg() {
  return (
    <svg
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
    >
      <path
        d="M3 5H11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M3 12H16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M3 19H21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}

export function MobileNav({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0',
            className,
          )}
        >
          <MobileBurgerSvg />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col gap-8 pr-0">
        <LinkCollection
          collection={PROPOSAL_LINK_COLLECTION}
          handleOpen={() => setOpen(false)}
        />
        <NavLink to={`/${USER_PROFILE_PATHS.BASE}`} end>
          <CircleUserRound />
        </NavLink>
      </SheetContent>
    </Sheet>
  );
}
