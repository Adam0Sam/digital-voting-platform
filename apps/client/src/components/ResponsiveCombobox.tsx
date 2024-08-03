import useWindowSize from '@/lib/hooks/useWindowSize';
import { ReactNode, useMemo, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';

export default function Combobox<T extends { label: string }>({
  items,
  handleSelect,
  defaultItem,
  children = 'Select',
}: {
  items: T[];
  handleSelect: (item: T) => void;
  defaultItem?: T;
  children?: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const windowSize = useWindowSize();
  // TODO: Is it worthwhile to use memoization here?
  const isDesktop = useMemo(() => windowSize.width > 768, [windowSize.width]);
  const [selectedItem, setSelectedItem] = useState<T | null>(
    defaultItem ?? null,
  );

  if (isDesktop) {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            {children}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <StatusList
            items={items}
            closeList={() => setIsOpen(false)}
            handleSelect={item => {
              setSelectedItem(item);
              handleSelect(item);
            }}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          {children}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <StatusList
            items={items}
            closeList={() => setIsOpen(false)}
            handleSelect={setSelectedItem}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function StatusList<T extends { label: string }>({
  items,
  closeList,
  handleSelect,
}: {
  items: T[];
  closeList: () => void;
  handleSelect: (item: T) => void;
}) {
  return (
    <Command>
      {/* <CommandInput placeholder="Filter status..." /> */}
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {items.map(item => (
            <CommandItem
              key={item.label}
              value={item.label}
              className="cursor-pointer"
              //   onSelect={value => {
              //     const foundItem =
              //       items.find(priority => priority.label === value) || null;
              //     if (foundItem) {
              //       handleSelect(foundItem);
              //       closeList();
              //     }
              //   }}
            >
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
