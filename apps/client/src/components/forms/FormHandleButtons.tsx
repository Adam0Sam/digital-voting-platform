import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

export default function FormHandleButtons({
  formSubmitLabel = 'Submit',
  formCancelLabel = 'Cancel',
  className,
  handleSubmitClick,
  handleCancelClick,
}: {
  formSubmitLabel?: string;
  formCancelLabel?: string;
  className?: string;
  handleSubmitClick?: () => void;
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
      <Button type="submit" className="flex-1" onClick={handleSubmitClick}>
        {formSubmitLabel}
      </Button>
    </div>
  );
}
