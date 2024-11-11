import { useState } from 'react';
import { useManagerProposal } from './ProposalManagePage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Timeline from '@/components/Timeline';
import { Proposal, ProposalStatus } from '@ambassador';
import { api } from '@/lib/api';
import ConfirmDialog from '@/components/ConfirmDialog';
import { triggerButtonStyleVariants } from '@/components/ui/dialog';

function constructMarkerArray(proposal: Proposal) {
  const getPercentage = getPercentageGenerator(
    new Date(proposal.startDate),
    new Date(proposal.endDate),
  );

  const markers = [
    {
      label: `Proposal Start`,
      positionPercentage: getPercentage(new Date(proposal.startDate)),
      tooltipNode: <p>{format(proposal.startDate, 'MMM d, yyyy')}</p>,
    },
    {
      label: 'Resolution Date',
      positionPercentage: getPercentage(new Date(proposal.resolutionDate)),
      tooltipNode: <p>{format(proposal.resolutionDate, 'MMM d, yyyy')}</p>,
    },
  ];

  if (
    new Date(proposal.resolutionDate).getTime() ===
    new Date(proposal.endDate).getTime()
  ) {
    return markers;
  }
  return [
    ...markers,
    {
      label: 'Proposal End',
      positionPercentage: getPercentage(new Date(proposal.endDate)),
      tooltipNode: <p>{format(proposal.endDate, 'MMM d, yyyy')}</p>,
    },
  ];
}

function getPercentageGenerator(startDate: Date, endDate: Date) {
  return function (date: Date) {
    const total = endDate.getTime() - startDate.getTime();
    const current = date.getTime() - startDate.getTime();
    return (current / total) * 100;
  };
}

export default function TimelinePage() {
  const { proposal, permissions } = useManagerProposal();
  const canEditResolutionDate = permissions.canEditDates;
  const [resolutionDate, setResolutionDate] = useState<Date>(
    new Date(proposal.resolutionDate),
  );

  const startDate = new Date(proposal.startDate);
  const endDate = new Date(proposal.endDate);

  const handleResolutionDateChange = (date: Date | undefined) => {
    if (!date) throw new Error('Date is undefined');
    if (!canEditResolutionDate) return;
    setResolutionDate(date);
    api.proposals.updateOne(proposal.id, {
      resolutionDate: date.toISOString(),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proposal Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <Timeline
          progressPercentage={getPercentageGenerator(
            startDate,
            endDate,
          )(new Date())}
          markers={constructMarkerArray({
            ...proposal,
            resolutionDate: resolutionDate.toISOString(),
          })}
        />

        <div className="mt-12 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <span>Resolution Date:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[240px] justify-start text-left font-normal',
                    !resolutionDate && 'text-muted-foreground',
                  )}
                  disabled={!permissions.canEditDates}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {resolutionDate ? (
                    format(resolutionDate, 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={resolutionDate}
                  onSelect={handleResolutionDateChange}
                  disabled={date =>
                    (date < startDate || date > endDate || date < new Date()) &&
                    canEditResolutionDate
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          {permissions.canManuallyResolve &&
            (proposal.status !== 'RESOLVED' ? (
              <div>
                <ConfirmDialog
                  handleConfirm={() =>
                    api.proposals.updateOne(proposal.id, {
                      status: ProposalStatus.RESOLVED,
                    })
                  }
                  triggerButton={{
                    text: 'Resolve Votes Now',
                    className: triggerButtonStyleVariants({
                      trigger: 'constructive',
                    }),
                  }}
                  confirmButton={{
                    text: 'Resolve Votes, Confirm',
                    className: triggerButtonStyleVariants({
                      trigger: 'constructive',
                    }),
                  }}
                  cancelButton={{
                    text: 'Cancel',
                    className: triggerButtonStyleVariants({
                      trigger: 'destructive',
                    }),
                  }}
                />
              </div>
            ) : (
              <div className="rounded-sm border-2 px-3 py-1">
                Votes Resolved
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
