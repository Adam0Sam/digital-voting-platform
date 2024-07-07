import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function RedirectingPlaceholder() {
  const { t } = useTranslation();
  const [dotCnt, setDotCnt] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setDotCnt(prev => (prev + 1) % 4);
    }, 400);
    return () => clearInterval(interval);
  }, []);
  return (
    <main className="text-1xl flex h-[100%] items-center justify-center text-[lavender] sm:text-2xl md:text-3xl">
      <div className="flex grow-0 flex-row">
        <h3>{t('Redirecting to Authentication Endpoint')}</h3>
        <div className="w-[3ch]">{' . '.repeat(dotCnt)}</div>
      </div>
    </main>
  );
}
