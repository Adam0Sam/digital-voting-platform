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
import { ProposalApi } from '@/lib/api';
import { getDateDifference } from '@/lib/time';
import { ProposalDto, ProposalVisibility } from '@/lib/types/proposal.type';
import { CalendarClock } from 'lucide-react';
import { Params, useLoaderData } from 'react-router-dom';

export const proposalVisibilityValueMap: Record<string, ProposalVisibility> = {
  public: ProposalVisibility.PUBLIC,
  restricted: ProposalVisibility.RESTRICTED,
  manager_only: ProposalVisibility.MANAGER_ONLY,
};

// TODO: This is a temporary type solution
type tempProposalData = ProposalDto & { id: string };

function ProposalByVisibilityCard({
  proposalData,
}: {
  proposalData: tempProposalData;
}) {
  let daysLeft, hoursLeft;

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
  } else {
    daysLeft = daysUntilStart;
    hoursLeft = hoursUntilStart;
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
                selected={
                  new Date(
                    hasStarted ? proposalData.endDate : proposalData.startDate,
                  )
                }
              />
            </PopoverContent>
          </Popover>
        </CardContent>
      </CardHeader>
    </Card>
  );
}

export default function ProposalByVisibilityPage() {
  const proposals = useLoaderData() as tempProposalData[];

  return (
    <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(10rem,30rem))] gap-16 px-16">
      {proposals.map(proposal => (
        <ProposalByVisibilityCard proposalData={proposal} key={proposal.id} />
      ))}
    </div>
  );
}

export const loader = async ({ params }: { params: Params<string> }) => {
  if (!params.visibility || !proposalVisibilityValueMap[params.visibility]) {
    throw new Response(`Invalid visibility parameter: ${params.visibility}`, {
      status: 400,
    });
  }
  const proposals = (await ProposalApi.getProposalsByVisibility(
    proposalVisibilityValueMap[params.visibility],
  )) as tempProposalData[];
  return proposals;
};
