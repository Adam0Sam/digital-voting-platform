import {
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { ScrollArea } from './ui/scroll-area';

type MultiSelectDropdownProps<T extends string> = {
  items: Record<string, T> | T[];
  triggerText: ReactNode;
};

export type MultiSelectDropdownHandle<T extends string> = {
  getSelectedItems: () => T[];
  setSelectedItems: (items: T[]) => void;
};

const MultiSelectDropdown = forwardRef(_MultiSelectDropdown) as <
  T extends string,
>(
  props: MultiSelectDropdownProps<T> & {
    ref?: React.Ref<MultiSelectDropdownHandle<T>>;
  },
) => ReturnType<typeof _MultiSelectDropdown>;

export default MultiSelectDropdown;

function _MultiSelectDropdown<T extends string>(
  { items, triggerText }: MultiSelectDropdownProps<T>,
  ref: React.Ref<MultiSelectDropdownHandle<T>>,
) {
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const allItems = useRef(Array.isArray(items) ? items : Object.values(items));

  useImperativeHandle(ref, () => ({
    getSelectedItems: () => selectedItems,
    setSelectedItems: items => setSelectedItems(items),
  }));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline">{triggerText}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="flex flex-col gap-2">
          <ScrollArea className="h-56">
            {allItems.current.map(item => (
              <DropdownMenuCheckboxItem
                onSelect={e => e.preventDefault()}
                key={item}
                checked={selectedItems.includes(item)}
                onCheckedChange={checked => {
                  setSelectedItems(prevItems =>
                    checked
                      ? [...prevItems, item]
                      : prevItems.filter(i => i !== item),
                  );
                }}
              >
                {item}
              </DropdownMenuCheckboxItem>
            ))}
          </ScrollArea>
          <Button
            onClick={() =>
              setSelectedItems(selectedItems.length > 0 ? [] : allItems.current)
            }
          >
            {selectedItems.length > 0 ? 'Clear All' : 'Select All'}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
