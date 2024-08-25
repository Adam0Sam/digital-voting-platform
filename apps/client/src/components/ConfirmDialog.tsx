import { ReactNode, useState } from 'react';
import { Button, ButtonStyleVariants } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { WithRequired } from '@/lib/types/utils/util-types';

type CustomButtonProps = {
  text?: ReactNode;
  className?: string;
  variant?: ButtonStyleVariants;
};

type ConfirmDialogProps = {
  triggerButton: WithRequired<CustomButtonProps, 'text'>;
  confirmButton?: CustomButtonProps;
  cancelButton?: CustomButtonProps;
  dialogTitle?: string;
  dialogDescription?: string;
  handleConfirm: () => void;
  handleCancel?: () => void;
};

export default function ConfirmDialog(props: ConfirmDialogProps) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={props.triggerButton.variant ?? 'ghost'}
          className={props.triggerButton.className}
        >
          {props.triggerButton.text}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {props.dialogTitle ?? 'Are you sure you want to proceed?'}
          </DialogTitle>
          <DialogDescription>{props.dialogDescription}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-10 gap-8 sm:justify-around">
          <Button
            variant={props?.confirmButton?.variant ?? 'ghost'}
            className={props?.confirmButton?.className}
            onClick={() => {
              props.handleConfirm();
              setDialogIsOpen(false);
            }}
          >
            {props?.confirmButton?.text ?? props.triggerButton.text}
          </Button>
          <Button
            variant={props?.cancelButton?.variant ?? 'ghost'}
            className={props?.cancelButton?.className}
            onClick={() => {
              props.handleCancel?.();
              setDialogIsOpen(false);
            }}
          >
            {props?.cancelButton?.text ?? 'Cancel'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
