import { MobileNav } from '@/components/nav';
import DesktopNav from '@/components/nav/DesktopNav';
import { Outlet } from 'react-router-dom';
export default function RootLayout() {
  return (
    <>
      <div className="ml-5 mt-6 w-[100%] md:ml-0 md:justify-center">
        <DesktopNav className="hidden md:flex" />
        <MobileNav className="md:hidden" />
      </div>
      <Outlet />
    </>
  );
}
