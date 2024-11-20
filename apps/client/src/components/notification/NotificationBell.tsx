import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavLink } from 'react-router-dom';
import { USER_PROFILE_HREFS } from '@/lib/routes';
import { useUnreadNotificationCount } from '@/App';

type NotificationBellProps = {
  className?: string;
};
const NotificationBell: React.FC<NotificationBellProps> = ({ className }) => {
  const { unreadNotifications } = useUnreadNotificationCount();
  return (
    <NavLink
      to={USER_PROFILE_HREFS.NOTIFICATIONS}
      end
      className={({ isActive }) =>
        cn(
          'relative flex items-center rounded-full p-2',
          isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
        )
      }
    >
      <Bell className="h-6 w-6" />
      {unreadNotifications > 0 && (
        <span className="absolute right-0 top-0 inline-flex -translate-y-1/4 translate-x-1/4 transform items-center justify-center rounded-full bg-red-600 px-2 py-1 text-xs font-bold leading-none text-red-100">
          {unreadNotifications > 99 ? '99+' : unreadNotifications}
        </span>
      )}
    </NavLink>
  );
};

export default NotificationBell;
