import { Key, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from './ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { cn } from '@/lib/utils';

type ComboboxItem<T> = {
  label: string;
  value: T;
};

export default function Combobox<T>({
  items,
  handleSelectedValue,
  defaultItem,
  children = 'Select',
  itemNamePlural = 'items',
}: {
  items: ComboboxItem<T>[];
  handleSelectedValue: (value: T) => void;
  defaultItem?: ComboboxItem<T>;
  children?: React.ReactNode;
  itemNamePlural?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ComboboxItem<T> | null>(
    defaultItem ?? null,
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-[200px] justify-between"
        >
          {selectedItem ? selectedItem.label : <>{children}</>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${itemNamePlural}...`} />
          <CommandEmpty>No {itemNamePlural} found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {items.map(item => (
                <CommandItem
                  key={String(item.value)}
                  value={item.label}
                  onSelect={() => {
                    setSelectedItem(item);
                    handleSelectedValue(item.value);
                    setIsOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      item.value === selectedItem?.value
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
