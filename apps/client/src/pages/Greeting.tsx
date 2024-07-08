import { useLoaderData, useNavigate } from 'react-router-dom';
import { User } from '../interfaces';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';

export default function Greeting() {
  const loadedUser: User = useLoaderData() as User;
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <main className="flex h-[100%] flex-col items-center justify-center gap-12">
      <h3 className="text-4xl">
        {t('Hello')}, {loadedUser.personalNames.join(' ')}
      </h3>
      <Button variant="default" size="lg" onClick={() => navigate('/home')}>
        {t('Explore the app')}
      </Button>
    </main>
  );
}
