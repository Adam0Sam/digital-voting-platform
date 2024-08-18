import { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { useSignedInUser } from '@/lib/hooks/useSignedInUser';

export default function UserStatus() {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
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
      <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="hover border-2 border-red-500 transition-colors hover:bg-red-500 hover:text-secondary"
          >
            Deactivate
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to deactivate your account?
            </DialogTitle>
            <DialogDescription>
              Deactivating your account will lock all access from this account.
              If you will want to reactivate your account, you will need to
              contact the system admin.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-10 sm:justify-around">
            <Button
              variant="destructive"
              onClick={() => {
                api.users.deactivateUserAccount();
                mutate({ active: false });
                navigate('/');
              }}
            >
              Deactivate
            </Button>
            <Button variant="outline" onClick={() => setDialogIsOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
