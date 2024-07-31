import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { getDateDifference } from '@/lib/time';
import { ProposalDto } from '@/lib/types/proposal.type';
import { CalendarClock } from 'lucide-react';

// TODO: This is a temporary type solution
export type tempProposalData = ProposalDto & { id: string };

export default function ProposalCard({
  proposalData,
}: {
  proposalData: tempProposalData;
}) {
  let daysLeft, hoursLeft;
  let displayedDate: Date;

  const { days: daysUntilStart, hours: hoursUntilStart } = getDateDifference(
    new Date(),
    proposalData.startDate,
  );

  const { days: daysUntilEnd, hours: hoursUntilEnd } = getDateDifference(
    new Date(),
    proposalData.endDate,
  );

  const hasStarted = daysUntilStart <= 0 && hoursUntilStart <= 0;
  if (hasStarted) {
    daysLeft = daysUntilEnd;
    hoursLeft = hoursUntilEnd;
    displayedDate = new Date(proposalData.endDate);
  } else {
    daysLeft = daysUntilStart;
    hoursLeft = hoursUntilStart;
    displayedDate = new Date(proposalData.startDate);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-center">
          <CardTitle className="text-xl">{proposalData.title}</CardTitle>
          <CardDescription>
            {proposalData.description ?? 'Empty description'}
          </CardDescription>
        </div>
        <CardContent className="flex flex-col items-center p-0 pt-6">
          <Popover>
            <div className="flex items-center gap-2">
              {`${hasStarted ? 'Ends' : 'Starts'} in ${daysLeft}d. ${hoursLeft}h.`}
              <PopoverTrigger asChild>
                <Button variant="ghost">
                  <CalendarClock size={24} />
                </Button>
              </PopoverTrigger>
            </div>
            <PopoverContent className="w-min">
              <Calendar
                mode="single"
                selected={displayedDate}
                defaultMonth={displayedDate}
              />
            </PopoverContent>
          </Popover>
        </CardContent>
      </CardHeader>
    </Card>
  );
}
