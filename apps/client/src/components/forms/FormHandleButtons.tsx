import { Button } from '../ui/button';

export default function FormHandleButtons({
  formSubmitLabel = 'Submit',
  formCancelLabel = 'Cancel',
  handleSubmitClick,
  handleCancelClick,
}: {
  formSubmitLabel?: string;
  formCancelLabel?: string;
  handleSubmitClick?: () => void;
  handleCancelClick?: () => void;
}) {
  return (
    <div className="flex gap-4">
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
