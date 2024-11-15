import { forwardRef, useImperativeHandle, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Check } from 'lucide-react';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

export type ComboboxItem<T> = {
  label: string;
  value: T;
  description?: string;
};

type ComboboxProps<T> = {
  items: ComboboxItem<T>[];
  handleSelectedValue?: (value: T) => void;
  defaultItem?: ComboboxItem<T>;
  itemNameSingular?: string;
  itemNamePlural?: string;
};

export type ComboboxHandle<T> = {
  getSelectedItem: () => ComboboxItem<T> | null;
  setSelectedItem: (item: ComboboxItem<T>) => void;
};

const Combobox = forwardRef(_Combobox) as <T>(
  props: ComboboxProps<T> & { ref?: React.Ref<ComboboxHandle<T>> },
) => ReturnType<typeof _Combobox>;

export default Combobox;

function _Combobox<T>(
  {
    items,
    handleSelectedValue,
    defaultItem,
    itemNameSingular = 'item',
    itemNamePlural = 'items',
  }: ComboboxProps<T>,
  ref: React.Ref<ComboboxHandle<T>>,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ComboboxItem<T> | null>(
    defaultItem ?? null,
  );
  useImperativeHandle(ref, () => ({
    getSelectedItem: () => selectedItem,
    setSelectedItem: item => {
      setSelectedItem(item);
    },
  }));

  // TODO: Make it so tooltip works
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          size="lg"
        >
          {selectedItem ? selectedItem.label : `Select ${itemNameSingular}`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <TooltipProvider>
          <Command>
            <CommandInput placeholder={`Search ${itemNamePlural}...`} />
            <CommandEmpty>No {itemNamePlural} found.</CommandEmpty>
            <CommandGroup>
              <CommandList>
                {items.map(item => (
                  <Tooltip key={String(item.value)}>
                    <TooltipTrigger asChild>
                      <CommandItem
                        value={item.label}
                        onSelect={() => {
                          setSelectedItem(item);
                          handleSelectedValue?.(item.value);
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
                    </TooltipTrigger>
                    <TooltipContent>
                      {item.description ?? `Select ${itemNameSingular}`}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </TooltipProvider>
      </PopoverContent>
    </Popover>
  );
}
