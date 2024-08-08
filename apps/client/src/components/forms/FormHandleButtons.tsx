import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { ReactNode } from 'react';

export default function FormHandleButtons({
  formSubmitLabel = 'Submit',
  formCancelLabel = 'Cancel',
  className,
  enableSubmit = true,
  handleSubmitClick,
  enableCancel = true,
  handleCancelClick,
}: {
  formSubmitLabel?: ReactNode;
  formCancelLabel?: ReactNode;
  className?: string;
  enableSubmit?: boolean;
  handleSubmitClick?: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
  enableCancel?: boolean;
  handleCancelClick?: () => void;
}) {
  return (
    <div className={cn('flex gap-4', className)}>
      {enableCancel && handleCancelClick && (
        <Button
          onClick={handleCancelClick}
          variant="secondary"
          type="button"
          className="flex-1"
        >
          {formCancelLabel}
        </Button>
      )}
      {enableSubmit && handleSubmitClick && (
        <Button
          type="submit"
          className="flex-1"
          onClick={e => handleSubmitClick?.(e)}
        >
          {formSubmitLabel}
        </Button>
      )}
    </div>
  );
}
