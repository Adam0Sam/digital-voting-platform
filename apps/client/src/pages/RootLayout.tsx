import { useUser } from '@/App';
import { MobileNav } from '@/components/nav';
import { DesktopNav } from '@/components/nav';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { AUTH_PATHS } from '@/lib/routes';
import { Outlet, useNavigate } from 'react-router-dom';

export default function RootLayout() {
  const { user, isFetchingUser } = useUser();
  const navigate = useNavigate();

  if (!user && isFetchingUser) {
    return <h1>Loading...</h1>;
  }

  if (!user && !isFetchingUser) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-12">
          <h1 className="text-4xl">Failed to fetch user data.</h1>
          <div className="smjustify-between flex flex-col gap-8 sm:flex-row">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate(AUTH_PATHS.SIGNUP)}
            >
              Sign up with your school account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!user!.active) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-12">
          <h1 className="text-4xl">Your account is deactivated.</h1>
          <div className="smjustify-between flex flex-col gap-8 sm:flex-row">
            <Button variant="secondary" size="lg">
              Contact Admin
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate(AUTH_PATHS.SIGNUP)}
            >
              New Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="my-10 ml-5 md:ml-0 md:justify-center">
        <DesktopNav className="hidden md:flex" />
        <MobileNav className="md:hidden" />
      </div>
      <Outlet />
      <Toaster />
    </div>
  );
}
