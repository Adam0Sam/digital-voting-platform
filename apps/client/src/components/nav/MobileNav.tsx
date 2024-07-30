import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { cn } from '@/lib/utils';
import { Armchair } from 'lucide-react';
import React from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LinkComponentProps } from './interfaces';
import { proposalLinkCollection, testLinkCollection } from './link-collections';

interface MobileLinkItemProps extends LinkComponentProps {
  onOpenChange?: (open: boolean) => void;
}

const LinkItem = ({
  to,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkItemProps) => {
  return (
    <NavLink
      to={to}
      onClick={() => {
        onOpenChange?.(false);
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </NavLink>
  );
};

LinkItem.displayName = 'LinkItem';

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
      <SheetContent side="left" className="pr-0">
        <LinkItem to="/" className="flex items-center" onOpenChange={setOpen}>
          {proposalLinkCollection.icon && (
            <proposalLinkCollection.icon className="mr-2 h-4 w-4" />
          )}
          <span className="font-bold">{proposalLinkCollection.name}</span>
        </LinkItem>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
            {proposalLinkCollection.items.map(
              item =>
                item.href && (
                  <LinkItem
                    key={item.href}
                    to={item.href}
                    onOpenChange={setOpen}
                  >
                    {item.title}
                  </LinkItem>
                ),
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex flex-col space-y-3 pt-6">
              <h4 className="font-medium">{testLinkCollection.name}</h4>
              {testLinkCollection.items.map((item, index) => (
                <React.Fragment key={item.href}>
                  {true &&
                    (item.href ? (
                      <LinkItem
                        to={item.href}
                        onOpenChange={setOpen}
                        className="text-muted-foreground"
                      >
                        {item.title}
                        {true && (
                          <span className="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">
                            {`Item ${index}`}
                          </span>
                        )}
                      </LinkItem>
                    ) : (
                      item.title
                    ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
