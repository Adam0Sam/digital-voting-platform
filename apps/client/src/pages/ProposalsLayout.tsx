import { MobileNav } from '@/components/nav';
import DesktopNav from '@/components/nav/DesktopNav';
import { Outlet } from 'react-router-dom';

export default function ProposalsLayout() {
  return (
    <div className="flex h-full flex-col">
      <div className="my-10 ml-5 md:ml-0 md:justify-center">
        <DesktopNav className="hidden md:flex" />
        <MobileNav className="md:hidden" />
      </div>
      <Outlet />
    </div>
  );
}
