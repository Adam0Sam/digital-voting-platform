import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Settings } from 'lucide-react';
import { useState } from 'react';

export default function ChoiceCountPopover({
  maxChoiceCount,
  handleSelect,
  defaultChoiceCount,
}: {
  maxChoiceCount: number;
  handleSelect?: (value: number) => void;
  defaultChoiceCount?: number;
}) {
  const [choiceCount, setChoiceCount] = useState(defaultChoiceCount ?? 1);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value < 1 || value > maxChoiceCount) {
      setError(`Choice count must be between 1 and ${maxChoiceCount}`);
      return;
    }
    setError(null);
    setChoiceCount(value);
    handleSelect?.(value);
  };
  // TODO: Make this mobile friendly with Drawer component
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <p className="mr-4">Settings</p>
          <Settings />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Choice Count</h4>
            <p className="text-sm text-muted-foreground">
              Decide how many resolutions an involved party can vote for.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxHeight">Count</Label>
              <Input
                id="maxHeight"
                className="col-span-2 h-8"
                type="number"
                value={choiceCount}
                onChange={handleInputChange}
                max={maxChoiceCount}
                min={1}
              />
            </div>
            {error && (
              <p className="text-center text-sm text-destructive">{error}</p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
