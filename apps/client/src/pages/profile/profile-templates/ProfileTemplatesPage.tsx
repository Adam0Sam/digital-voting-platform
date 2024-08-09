import { USER_TEMPLATES_HREFS } from '@/lib/routes';

import { StandaloneNavLink } from '@/components/nav/NavLinkItem';
import { Outlet } from 'react-router-dom';

export default function ProfileTemplatesPage() {
  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-4">
        <h4 className="text-2xl">Profile Templates</h4>
        <div className="flex rounded-md border-2 border-solid border-muted">
          <StandaloneNavLink
            to={USER_TEMPLATES_HREFS.BASE}
            className="flex-1 rounded-none"
            textClassName="text-primary"
          >
            Create a new randrom template
          </StandaloneNavLink>
          <StandaloneNavLink
            to={USER_TEMPLATES_HREFS.MANAGER}
            className="flex-1 rounded-none"
            textClassName="text-primary"
          >
            Manager Templates
          </StandaloneNavLink>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
