import { useState } from 'react';
import { default as NotificationCard } from '@/components/NotificationCard';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LOADER_IDS,
  useAsyncLoaderValue,
  useDeferredLoadedData,
} from '@/lib/loaders';
import { Suspense } from 'react';
import { Await } from 'react-router-dom';
import { api } from '@/lib/api';
import { UserNotification } from '@ambassador';
import { DelayedFulfill } from '@/lib/delayed-fulfill';

export default function NotificationPage() {
  const notifications = useDeferredLoadedData(LOADER_IDS.NOTIFICATIONS);
  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto px-4 py-4 sm:px-6 sm:py-6 md:py-8">
        <h1 className="mb-4 text-2xl font-bold sm:mb-6 sm:text-3xl md:text-4xl">
          Notifications
        </h1>

        <Suspense fallback={<NotificationsSkeleton />}>
          <Await resolve={notifications.data}>
            <Notifications />
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

function NotificationsSkeleton() {
  return (
    <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-32 w-full rounded-lg" />
      ))}
    </div>
  );
}

function Notifications() {
  const notifications = useAsyncLoaderValue(LOADER_IDS.NOTIFICATIONS);
  const [readNotifications, setReadNotifications] = useState<
    Set<UserNotification>
  >(new Set(notifications.filter(n => n.read)));

  const removeNotificationFromRead = (notification: UserNotification) => {
    setReadNotifications(prev => {
      const newSet = new Set(prev);
      newSet.delete(notification);
      return newSet;
    });
  };

  const addNotificationToRead = (notification: UserNotification) => {
    setReadNotifications(prev => new Set(prev).add(notification));
  };

  const handleMarkAsRead = (notification: UserNotification) => {
    const delayedFulfill = new DelayedFulfill(2500, async () => {
      api.notification.markAsRead(notification.id);
    });
    addNotificationToRead(notification);
    delayedFulfill.beginResolve();
    delayedFulfill.showUndoToast('Marked as read', () =>
      removeNotificationFromRead(notification),
    );
  };

  const handleMarkAsUnread = (notification: UserNotification) => {
    const delayedFulfill = new DelayedFulfill(2500, async () => {
      api.notification.markAsUnread(notification.id);
    });
    removeNotificationFromRead(notification);
    delayedFulfill.beginResolve();
    delayedFulfill.showUndoToast('Marked as unread', () =>
      addNotificationToRead(notification),
    );
  };

  const unreadNotifications = notifications.filter(
    n => !readNotifications.has(n),
  );

  return (
    <div className="flex flex-col gap-8">
      {unreadNotifications.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">Unread Notifications</h2>
          <div className="grid gap-6 [grid-auto-rows:max-content] md:grid-cols-2 lg:grid-cols-3">
            {unreadNotifications.map(notification => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onReadToggle={handleMarkAsRead}
              />
            ))}
          </div>
        </div>
      )}
      {readNotifications.size > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">Read Notifications</h2>
          <div className="grid gap-6 [grid-auto-rows:max-content] sm:grid-cols-2 lg:grid-cols-3">
            {Array.from(readNotifications).map(notification => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onReadToggle={handleMarkAsUnread}
                isRead
              />
            ))}
          </div>
        </div>
      )}
      {notifications.length === 0 && (
        <p className="text-center text-gray-500">
          No notifications to display.
        </p>
      )}
    </div>
  );
}
