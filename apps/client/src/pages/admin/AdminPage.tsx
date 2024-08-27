import InnerPageNavButtons from '@/components/InnerPageNavButtons';
import { ADMIN_HREFS } from '@/lib/routes/admin.routes';
import { Outlet } from 'react-router-dom';

const hrefs = {
  Users: ADMIN_HREFS.USERS,
  Proposals: ADMIN_HREFS.PROPOSALS,
};

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-8 px-10 sm:px-20">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <h3 className="text-4xl font-bold">Manager Dashboard</h3>
        </div>
        <InnerPageNavButtons hrefEntries={hrefs} />
      </div>
      <Outlet />
    </div>
  );
}
