import { MobileNav } from '@/components/nav';
import DesktopNav from '@/components/nav/DesktopNav';
import { Toaster } from '@/components/ui/sonner';
import { SignedInUserContextProvider } from '@/context/userContext';
import { Outlet } from 'react-router-dom';
export default function RootLayout() {
  return (
    <SignedInUserContextProvider>
      <div className="flex h-full flex-col">
        <div className="my-10 ml-5 md:ml-0 md:justify-center">
          <DesktopNav className="hidden md:flex" />
          <MobileNav className="md:hidden" />
        </div>
        <Outlet />
        <Toaster />
      </div>
    </SignedInUserContextProvider>
  );
}
