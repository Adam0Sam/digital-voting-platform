import { useState } from 'react';
import { default as NotificationCard } from '@/components/notification/NotificationCard';
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
import { useUnreadNotificationCount } from '@/App';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Clock } from 'lucide-react';

export default function NotificationPage() {
  const notifications = useDeferredLoadedData(LOADER_IDS.NOTIFICATIONS);
  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 md:py-8">
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
  const notifications = useAsyncLoaderValue(LOADER_IDS.NOTIFICATIONS).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const { mutate } = useUnreadNotificationCount();
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
    api.notification.markAsRead(notification.id);
    addNotificationToRead(notification);
    mutate().decrementBy(1);
  };

  const handleMarkAsUnread = (notification: UserNotification) => {
    api.notification.markAsUnread(notification.id);
    removeNotificationFromRead(notification);
    mutate().incrementBy(1);
  };

  const handleMarkAllAsRead = () => {
    api.notification.markAllAsRead();
    setReadNotifications(new Set(notifications));
    mutate().set(0);
  };

  const unreadNotifications = notifications.filter(
    n => !readNotifications.has(n),
  );

  return (
    <Tabs defaultValue="unread" className="w-full">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <TabsList className="mb-2 sm:mb-0">
          <TabsTrigger value="unread">
            Unread ({unreadNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="read">
            Read ({readNotifications.size})
          </TabsTrigger>
        </TabsList>
        <div className="flex items-center space-x-2">
          {unreadNotifications.length > 0 && (
            <Button
              onClick={handleMarkAllAsRead}
              variant="outline"
              size="sm"
              className="flex-shrink-0"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark All as Read
            </Button>
          )}
          <p className="text-sm text-muted-foreground">
            <Clock className="mr-1 inline-block h-4 w-4" />
            Auto-delete after 1 month
          </p>
        </div>
      </div>

      <TabsContent value="unread">
        {unreadNotifications.length > 0 ? (
          <div className="grid gap-6 [grid-auto-rows:max-content] xl:grid-cols-2 2xl:grid-cols-3">
            {unreadNotifications.map(notification => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onReadToggle={handleMarkAsRead}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No unread notifications.</p>
        )}
      </TabsContent>

      <TabsContent value="read">
        {readNotifications.size > 0 ? (
          <div className="grid gap-6 [grid-auto-rows:max-content] xl:grid-cols-2 2xl:grid-cols-3">
            {Array.from(readNotifications).map(notification => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onReadToggle={handleMarkAsUnread}
                isRead
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No read notifications.</p>
        )}
      </TabsContent>

      {notifications.length === 0 && (
        <p className="text-center text-gray-500">
          No notifications to display.
        </p>
      )}
    </Tabs>
  );
}
