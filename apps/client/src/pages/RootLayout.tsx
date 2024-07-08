import AppNavigation from '@/components/NavigationMenu';
import { Outlet } from 'react-router-dom';
export default function RootLayout() {
  return (
    <div className="flex flex-col items-center justify-start">
      <AppNavigation />
      <Outlet />
    </div>
  );
}
