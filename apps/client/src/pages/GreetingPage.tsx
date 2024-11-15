import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSignedInUser } from '@/lib/hooks/useSignedInUser';
import { PROPOSAL_HREFS } from '@/lib/routes';
import { UserRole } from '@ambassador/user';
import { ADMIN_HREFS } from '@/lib/routes/admin.routes';
import { ArrowRight, UserCircle, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function GreetingPage() {
  const { user } = useSignedInUser();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isAdmin = user.roles.includes(UserRole.ADMIN);

  return (
    <main className="container mx-auto flex min-h-screen items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold">
            {t('Welcome')}, {user?.personalNames.join(' ')}!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-lg text-muted-foreground">
            {t('What would you like to do today?')}
          </p>
          <div
            className={cn('grid gap-6', {
              'sm:grid-cols-1': !isAdmin,
              'sm:grid-cols-2': isAdmin,
            })}
          >
            <Button
              variant="default"
              size="lg"
              onClick={() => navigate(PROPOSAL_HREFS.BASE)}
              className="flex items-center justify-center gap-2"
            >
              <UserCircle className="h-5 w-5" />
              {t('Explore User App')}
              <ArrowRight className="h-5 w-5" />
            </Button>
            {isAdmin && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate(ADMIN_HREFS.BASE)}
                className="flex items-center justify-center gap-2"
              >
                <ShieldCheck className="h-5 w-5" />
                {t('Access Admin Panel')}
                <ArrowRight className="h-5 w-5" />
              </Button>
            )}
          </div>
          {isAdmin && (
            <p className="text-center text-sm text-muted-foreground">
              {t('You have admin privileges')}
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
