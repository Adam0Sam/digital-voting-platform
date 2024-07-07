import { useLoaderData, useNavigate } from 'react-router-dom';
import { User } from '../interfaces';
import { useTranslation } from 'react-i18next';

export default function Greeting() {
  // const loadedUser: User = useLoaderData() as User;
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <main className="flex h-[100%] flex-col items-center justify-center gap-12 bg-background">
      <h3 className="text-4xl text-[lavender]">
        {/* {t('Hello')}, {loadedUser.personalNames.join(' ')} */}
      </h3>
      <div className="flex gap-10">
        {/* {loadedUser.roles.map(role => (
          <button
            key={role}
            onClick={() => navigate('/home')}
            className="hover:bg-lavender-light rounded-md bg-lavender px-8 py-4 text-rich-black transition-colors"
          >
            {t(`Explore ${role.toLowerCase()} the app`)}
          </button>
        ))} */}
      </div>
    </main>
  );
}
