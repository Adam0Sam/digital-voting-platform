import { useLoaderData, useNavigate } from 'react-router-dom';
import { User } from '../interfaces';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { useAppDispatch } from '@/store/hooks';
import { useEffect } from 'react';
import { setUser } from '@/store/features/userSlice';

export default function GreetingPage() {
  const loadedUser: User = useLoaderData() as User;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setUser(loadedUser));
  }, []);
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
