import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { useSignedInUser } from '@/lib/hooks/useSignedInUser';
import { PROPOSAL_HREFS } from '@/lib/routes';

export default function GreetingPage() {
  const user = useSignedInUser();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <main className="flex h-[100%] flex-col items-center justify-center gap-12">
      <h3 className="text-4xl">
        {t('Hello')}, {user?.personalNames.join(' ')}
      </h3>
      <Button
        variant="default"
        size="lg"
        onClick={() => navigate(PROPOSAL_HREFS.BASE)}
      >
        {t('Explore the app')}
      </Button>
    </main>
  );
}
