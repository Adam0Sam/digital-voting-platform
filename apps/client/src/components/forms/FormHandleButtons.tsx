import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { ReactNode } from 'react';

export default function FormHandleButtons({
  formSubmitLabel = 'Submit',
  formCancelLabel = 'Cancel',
  className,
  handleSubmitClick,
  handleCancelClick,
}: {
  formSubmitLabel?: ReactNode;
  formCancelLabel?: ReactNode;
  className?: string;
  handleSubmitClick?: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
  handleCancelClick?: () => void;
}) {
  return (
    <div className={cn('flex gap-4', className)}>
      {handleCancelClick && (
        <Button
          onClick={handleCancelClick}
          variant="secondary"
          type="button"
          className="flex-1"
        >
          {formCancelLabel}
        </Button>
      )}
      <Button
        type="submit"
        className="flex-1"
        onClick={e => handleSubmitClick?.(e)}
      >
        {formSubmitLabel}
      </Button>
    </div>
  );
}
