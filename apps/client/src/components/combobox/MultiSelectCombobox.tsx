'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ComboboxItem } from './type';
import { useState } from 'react';
import { CommandList } from 'cmdk';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MultiSelectComboboxProps<T> {
  items: ComboboxItem<T>[];
  defaultItems?: ComboboxItem<T>[];
  placeholder?: string;
  emptyMessage?: string;
  onChange: (selectedItems: T[]) => void;
}

const MAX_VISIBLE_BADGES = 3;

export function MultiSelectCombobox<T>({
  items,
  defaultItems = [],
  placeholder = 'Select items...',
  emptyMessage = 'No items found.',
  onChange,
}: MultiSelectComboboxProps<T>) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<T[]>(defaultItems.map(i => i.value));
  const [inputValue, setInputValue] = useState('');

  const handleSelect = (currentValue: T) => {
    setSelected(prev => {
      const newSelected = prev.includes(currentValue)
        ? prev.filter(item => item !== currentValue)
        : [...prev, currentValue];
      onChange(newSelected);
      return newSelected;
    });
  };

  const handleRemove = (item: T) => {
    setSelected(prev => {
      const newSelected = prev.filter(i => i !== item);
      onChange(newSelected);
      return newSelected;
    });
  };

  const visibleBadges = selected.slice(0, MAX_VISIBLE_BADGES);
  const remainingBadgesCount = selected.length - MAX_VISIBLE_BADGES;

  const renderBadges = () => (
    <div className="flex max-w-full flex-wrap items-center gap-1">
      {visibleBadges.map((item, i) => (
        <Badge key={i} variant="secondary" className="mr-1">
          {items.find(option => option.value === item)?.label}
          <button
            className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleRemove(item);
              }
            }}
            onMouseDown={e => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              handleRemove(item);
            }}
          >
            {}
            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
          </button>
        </Badge>
      ))}
      {remainingBadgesCount > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="cursor-pointer">
                +{remainingBadgesCount} more
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex flex-col gap-1">
                {selected.slice(MAX_VISIBLE_BADGES).map((item, i) => (
                  <div key={i}>
                    {items.find(option => option.value === item)?.label}
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between hover:bg-muted"
        >
          <div className="flex items-center truncate">
            {selected.length > 0 ? renderBadges() : placeholder}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search items..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            <CommandList>
              {items.map((item, i) => (
                <CommandItem
                  key={i}
                  value={item.label}
                  onSelect={() => {
                    handleSelect(item.value);
                    setInputValue('');
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selected.includes(item.value)
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
