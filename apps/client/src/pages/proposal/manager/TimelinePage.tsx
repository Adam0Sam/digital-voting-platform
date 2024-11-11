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
import { cn, getProgressBetweenDates } from '@/lib/utils';
import Timeline, { constructMarkerArray } from '@/components/Timeline';
import { ProposalStatus } from '@ambassador';
import { api } from '@/lib/api';
import ConfirmDialog from '@/components/ConfirmDialog';
import { triggerButtonStyleVariants } from '@/components/ui/dialog';
import { useRevalidator } from 'react-router-dom';

export default function TimelinePage() {
  const { proposal, permissions } = useManagerProposal();
  const revalidator = useRevalidator();
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
          progressPercentage={getProgressBetweenDates(
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
                    api.proposals
                      .updateOne(proposal.id, {
                        status: ProposalStatus.RESOLVED,
                      })
                      .then(() => {
                        revalidator.revalidate();
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
