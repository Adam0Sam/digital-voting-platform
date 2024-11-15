import { Button } from '@/components/ui/button';
import { ADMIN_HREFS } from '@/lib/routes';
import { ActionLogEntry } from '@ambassador';
import { ColumnDef, FilterFn, Row } from '@tanstack/react-table';
import { ArrowRight, Eye, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { format, formatDistanceToNow } from 'date-fns';

const timeColumnFilterFn: FilterFn<ActionLogEntry> = (row, _, value) => {
  const rowTime = new Date(row.original.time).getTime();
  const [end, start] = value;
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  return rowTime >= startTime && rowTime <= endTime;
};

const actionColumnFilterFn: FilterFn<ActionLogEntry> = (row, _, value) => {
  return value.includes(row.original.action);
};

function ProposalLinkButton({ row }: { row: Row<ActionLogEntry> }) {
  const navigate = useNavigate();
  const proposalId = row.original.proposalId;
  if (!proposalId) {
    return null;
  }
  const handleClick = () => {
    navigate(ADMIN_HREFS.PROPOSAL(proposalId));
  };
  return (
    <Button onClick={handleClick} variant="secondary" size="sm">
      <ArrowRight size={16} />
    </Button>
  );
}

function MessageCell({
  row,
  previewMessageLength = 20,
}: {
  row: Row<ActionLogEntry>;
  previewMessageLength?: number;
}) {
  const message = row.original.message;
  if (!message) {
    return null;
  }
  const previewMessage =
    message.length > previewMessageLength
      ? `${message.slice(0, previewMessageLength)}...`
      : message;

  return (
    <div className="flex items-center space-x-2">
      <span className="truncate">{previewMessage}</span>
      {message.length > previewMessageLength && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex cursor-help items-center space-x-2">
                <Eye className="h-4 w-4 flex-shrink-0" />
                <span className="sr-only">View full message</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-64">{message}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

function TimeCell({ row }: { row: Row<ActionLogEntry> }) {
  const time = new Date(row.original.time);
  const formattedTime = format(time, 'PPpp');
  const relativeTime = formatDistanceToNow(time, { addSuffix: true });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex cursor-help items-center space-x-2">
            <span>{relativeTime}</span>
            <Calendar className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-64">{formattedTime}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export const logColumns: ColumnDef<ActionLogEntry>[] = [
  {
    accessorKey: 'action',
    cell: ({ row }) => <div>{row.original.action}</div>,
    filterFn: actionColumnFilterFn,
  },
  {
    accessorKey: 'time',
    cell: TimeCell,
    filterFn: timeColumnFilterFn,
  },
  {
    accessorKey: 'message',
    cell: MessageCell,
  },
  {
    accessorKey: 'proposalId',
    cell: ProposalLinkButton,
  },
];
