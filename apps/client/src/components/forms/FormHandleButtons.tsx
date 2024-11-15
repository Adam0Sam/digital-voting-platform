import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { ReactNode } from 'react';

type FormHandleButtonsProps = {
  formSubmitLabel?: ReactNode;
  formCancelLabel?: ReactNode;
  className?: string;
  enableSubmit?: boolean;
  handleSubmitClick?: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
  enableCancel?: boolean;
  submitClassName?: string;
  cancelClassName?: string;
  handleCancelClick?: () => void;
};

export default function FormHandleButtons({
  formSubmitLabel = 'Submit',
  formCancelLabel = 'Cancel',
  className,
  enableSubmit = true,
  handleSubmitClick,
  enableCancel = true,
  handleCancelClick,
  submitClassName,
  cancelClassName,
}: FormHandleButtonsProps) {
  return (
    <div className={cn('flex gap-4', className)}>
      {enableCancel && handleCancelClick && (
        <Button
          onClick={handleCancelClick}
          variant="secondary"
          type="button"
          className={cn('flex-1', cancelClassName)}
        >
          {formCancelLabel}
        </Button>
      )}
      {enableSubmit && handleSubmitClick && (
        <Button
          type="submit"
          className={cn('flex-1', submitClassName)}
          onClick={e => handleSubmitClick?.(e)}
        >
          {formSubmitLabel}
        </Button>
      )}
    </div>
  );
}
