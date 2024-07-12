import { MobileNav } from '@/components/nav';
import DesktopNav from '@/components/nav/DesktopNav';
import { Outlet } from 'react-router-dom';
export default function RootLayout() {
  return (
    <>
      <nav className="ml-5 mt-6 flex items-center justify-start md:ml-0 md:justify-center">
        <DesktopNav />
        <MobileNav />
      </nav>
      <Outlet />
    </>
  );
}
