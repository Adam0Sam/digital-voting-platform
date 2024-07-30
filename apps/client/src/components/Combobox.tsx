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

export default function Combobox<T>({
  items,
  handleSelect,
  defaultValue,
  children = 'Select',
  itemNamePlural = 'items',
}: {
  items: { label: string; value: T }[];
  handleSelect: (value: T) => void;
  defaultValue?: T;
  children?: React.ReactNode;
  itemNamePlural?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<T | null>(
    defaultValue ?? null,
  );

  console.log('items', items);
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-[200px] justify-between"
        >
          {selectedValue ? (
            items.find(item => item.value === selectedValue)?.label
          ) : (
            <>{children}</>
          )}
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
                  key={item.value}
                  value={item.value}
                  onSelect={() => {
                    setSelectedValue(item.value);
                    setIsOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      item.value === selectedValue
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
