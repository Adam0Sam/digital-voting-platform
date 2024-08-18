import EmailForm from '@/components/forms/EmailForm';
import { api } from '@/lib/api';
import { useSignedInUser } from '@/lib/hooks/useSignedInUser';

export default function ProfileSettingsPage() {
  const { user, mutate } = useSignedInUser();
  return (
    <div className="flex flex-col">
      <EmailForm
        onSubmit={({ email }) => {
          api.users.setUserEmail(user.id, email);
          mutate({ ...user, email });
        }}
        defaultEmail={user.email}
        direction="horizontal"
      />
    </div>
  );
}
