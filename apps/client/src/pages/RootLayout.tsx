import { useUser } from '@/App';
import { MobileNav } from '@/components/nav';
import { DesktopNav } from '@/components/nav';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { AUTH_PATHS } from '@/lib/routes';
import { Outlet, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle, Mail } from 'lucide-react';

export default function RootLayout() {
  const { user, isFetchingUser } = useUser();
  const navigate = useNavigate();

  if (isFetchingUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-[350px]">
          <CardContent className="flex flex-col items-center pt-6">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="mt-4 text-lg font-semibold">Loading user data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-destructive">
              <AlertCircle className="h-6 w-6" />
              Failed to fetch user data
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="mb-6 text-center text-muted-foreground">
              We couldn't retrieve your user information. Please sign up or try
              again later.
            </p>
            <Button
              variant="default"
              size="lg"
              className="w-full"
              onClick={() => navigate(AUTH_PATHS.SIGNUP)}
            >
              Sign up with your school account
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user.active) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-destructive">
              <AlertCircle className="h-6 w-6" />
              Account Deactivated
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p className="text-center text-muted-foreground">
              Your account has been deactivated. Please contact an administrator
              or create a new account.
            </p>
            <div className="flex w-full flex-col gap-4 sm:flex-row">
              <Button variant="secondary" size="lg" className="flex-1">
                <Mail className="mr-2 h-4 w-4" />
                Contact Admin
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => navigate(AUTH_PATHS.SIGNUP)}
              >
                New Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto py-4">
          <DesktopNav className="hidden md:flex" />
          <MobileNav className="md:hidden" />
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}
