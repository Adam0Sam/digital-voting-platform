import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  Info,
  AlertTriangle,
  Eye,
  EyeOff,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { UserNotification, UserNotificationType } from '@ambassador';
import { PROPOSAL_HREFS } from '@/lib/routes';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { formatDistanceToNow } from 'date-fns';

const NotificationType = {
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
} as const;

type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

function getNotificationType(type: UserNotificationType): NotificationType {
  switch (type) {
    case UserNotificationType.VOTE_SUGGESTION:
    case UserNotificationType.PROPOSAL_UPDATE:
      return NotificationType.INFO;
    case UserNotificationType.PROPOSAL_RESOLUTION:
    case UserNotificationType.PROPOSAL_ACTIVATION:
    case UserNotificationType.VOTE_ENABLED:
      return NotificationType.SUCCESS;
    case UserNotificationType.PROPOSAL_ABORTION:
    case UserNotificationType.VOTE_DISABLED:
      return NotificationType.WARNING;
  }
}

function getNotificationContent(notification: UserNotification): {
  title: string;
  message?: string;
} {
  const { package: pkg, proposal } = notification;
  const { type, content } = pkg;

  switch (type) {
    case UserNotificationType.VOTE_SUGGESTION:
      return {
        title: 'New Vote Suggestion',
        message: `Proposal "${proposal.title}" manager ${content.suggestedBy} has suggested votes for you: ${content.candidates.map(c => c.value).join(', ')}.`,
      };

    case UserNotificationType.PROPOSAL_RESOLUTION:
      return {
        title: 'Proposal Resolved',
        message: `The results for "${proposal.title}" have been announced`,
      };
    case UserNotificationType.PROPOSAL_ABORTION:
      return {
        title: 'Proposal Aborted',
        message: `The proposal "${proposal.title}" has been aborted.`,
      };
    case UserNotificationType.PROPOSAL_ACTIVATION:
      return {
        title: 'Proposal Activated',
        message: `Voting has started for proposal "${proposal.title}".`,
      };
    case UserNotificationType.PROPOSAL_UPDATE:
      return {
        title: 'Proposal Updated',
        message: `The ${content.updatedFields.join(', ')} has been updated to "${content.updatedValues.join(', ')}" in "${proposal.title}".`,
      };
    case UserNotificationType.VOTE_DISABLED:
      return {
        title: 'Vote Deactivated',
        message: `Your ability to vote on proposal "${proposal.title}" has been disabled.`,
      };
    case UserNotificationType.VOTE_ENABLED:
      return {
        title: 'Vote Activated',
        message: `Your ability to vote on proposal "${proposal.title}" has been enabled!`,
      };
  }
}

const iconMap = {
  success: <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />,
  warning: <AlertTriangle className="h-5 w-5 flex-shrink-0 text-yellow-500" />,
  info: <Info className="h-5 w-5 flex-shrink-0 text-blue-500" />,
};

const borderColorMap = {
  success: 'border-green-500',
  warning: 'border-yellow-500',
  info: 'border-blue-500',
};

export type NotificationCardProps = {
  notification: UserNotification;
  onReadToggle: (notification: UserNotification) => void;
  isRead?: boolean;
};

export default function NotificationCard({
  notification,
  onReadToggle,
  isRead = false,
}: NotificationCardProps) {
  const type = getNotificationType(notification.package.type);
  const { title, message } = getNotificationContent(notification);
  const createdAt = new Date(notification.createdAt);
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });

  return (
    <Card
      className={cn(
        'relative mb-4 flex flex-col justify-between px-2 py-2 transition-all hover:shadow-md',
        borderColorMap[type],
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2 text-lg">
          <div className="flex items-center gap-2">
            {iconMap[type]}
            {title}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-2"
                  onClick={() => onReadToggle(notification)}
                >
                  {isRead ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {isRead ? 'Mark as Unread' : 'Mark as Read'}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isRead ? 'Mark as Unread' : 'Mark as Read'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{message}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2">
        <Button asChild variant="outline" className="flex-grow">
          <Link to={PROPOSAL_HREFS.VOTE(notification.proposalId)}>
            View Proposal
          </Link>
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="ml-2 flex items-center text-xs text-muted-foreground">
                <Clock className="mr-1 h-4 w-4" />
                {timeAgo}
              </div>
            </TooltipTrigger>
            <TooltipContent>{createdAt.toLocaleString()}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}
