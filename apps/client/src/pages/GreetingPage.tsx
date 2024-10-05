import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { useSignedInUser } from '@/lib/hooks/useSignedInUser';
import { PROPOSAL_HREFS } from '@/lib/routes';
import { UserRole } from '@ambassador/user';
import { ADMIN_HREFS } from '@/lib/routes/admin.routes';

export default function GreetingPage() {
  const { user } = useSignedInUser();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <main className="flex h-[100%] flex-col items-center justify-center gap-12">
      <h3 className="text-4xl">
        {t('Hello')}, {user?.personalNames.join(' ')}
      </h3>
      <div className="flex flex-col gap-8 sm:flex-row">
        <Button
          variant="default"
          size="lg"
          onClick={() => navigate(PROPOSAL_HREFS.BASE)}
          className="min-w-0 flex-1"
        >
          {t('Explore the user app')}
        </Button>
        {user.roles.includes(UserRole.ADMIN) && (
          <Button
            variant="default"
            size="lg"
            onClick={() => navigate(ADMIN_HREFS.BASE)}
            className="min-w-0 flex-1"
          >
            {t('Explore the admin app')}
          </Button>
        )}
      </div>
    </main>
  );
}
