import InnerPageNavLinks from '@/components/nav/InnerPageNavLinks';
import { ADMIN_HREFS } from '@/lib/routes/admin.routes';
import { Outlet } from 'react-router-dom';

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-8 px-10 sm:px-20">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <h3 className="text-4xl font-bold">Admin Dashboard</h3>
        </div>
        <InnerPageNavLinks
          forceFirstActive={true}
          links={[
            {
              title: 'Users',
              href: ADMIN_HREFS.USERS,
            },
            {
              title: 'Proposals',
              href: ADMIN_HREFS.PROPOSALS,
            },
          ]}
        />
      </div>
      <Outlet />
    </div>
  );
}
