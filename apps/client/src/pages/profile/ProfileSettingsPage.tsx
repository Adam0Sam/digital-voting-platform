import EmailForm from '@/components/forms/EmailForm';
import UserStatus from '@/components/UserStatus';
import { api } from '@/lib/api';
import { useSignedInUser } from '@/lib/hooks/useSignedInUser';

export default function ProfileSettingsPage() {
  const { user, mutate } = useSignedInUser();
  return (
    <div className="flex flex-col gap-8">
      <EmailForm
        onSubmit={({ email }) => {
          api.users.setUserEmail(email);
          mutate({ email });
        }}
        defaultEmail={user.email}
        direction="horizontal"
      />
      <UserStatus />
    </div>
  );
}
