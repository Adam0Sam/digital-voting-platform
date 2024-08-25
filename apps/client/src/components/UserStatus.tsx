import { triggerButtonStyleVariants } from './ui/dialog';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { useSignedInUser } from '@/lib/hooks/useSignedInUser';
import { cn } from '@/lib/utils';
import ConfirmDialog from './ConfirmDialog';

export default function UserStatus() {
  const { mutate } = useSignedInUser();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-1 rounded-md border-2 px-8 py-2 text-green-500 transition-colors">
        <span className="text-sm font-semibold">Active</span>
        <span className="text-xs text-muted-foreground">
          Your account is active
        </span>
      </div>
      <ConfirmDialog
        triggerButton={{
          text: 'Deactivate',
          className: cn(triggerButtonStyleVariants({ trigger: 'destructive' })),
        }}
        confirmButton={{
          variant: 'destructive',
        }}
        cancelButton={{
          variant: 'outline',
        }}
        dialogTitle="Are you sure you want to deactivate your account?"
        dialogDescription="Deactivating your account will lock all access from this account. If you will want to reactivate your account, you will need to contact the system admin."
        handleConfirm={() => {
          api.users.deactivateUserAccount();
          mutate({ active: false });
          navigate('/');
        }}
      />
    </div>
  );
}
