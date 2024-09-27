import { useState } from 'react';
import { triggerButtonStyleVariants } from '../ui/dialog';
import { api } from '@/lib/api';
import ConfirmDialog from '../ConfirmDialog';
import { cn } from '@/lib/utils';

type DeactivateUserButtonProps = {
  isUserActive: boolean;
  userId: string;
};
export default function DeactivateUserButton({
  isUserActive,
  userId,
}: DeactivateUserButtonProps) {
  const [isActive, setIsActive] = useState(isUserActive);
  return (
    <div className="flex justify-center">
      <ConfirmDialog
        triggerButton={{
          text: isActive ? 'Deactivate' : 'Activate',
          className: cn(
            triggerButtonStyleVariants({
              trigger: isActive ? 'destructive' : 'constructive',
            }),
          ),
        }}
        confirmButton={{
          className: cn(
            triggerButtonStyleVariants({
              trigger: isActive ? 'destructive' : 'constructive',
            }),
          ),
        }}
        cancelButton={{
          variant: 'outline',
        }}
        dialogTitle={`Are you sure you want to ${isActive ? 'deactivate' : 'activate'} this account?`}
        handleConfirm={() => {
          api.admin.deactivateUser(userId);
          setIsActive(prevStatus => !prevStatus);
        }}
      />
    </div>
  );
}
