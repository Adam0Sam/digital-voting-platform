import CardWrapper from '@/components/CardWrapper';
import DateForm from '@/components/forms/DateForm';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { api } from '@/lib/api';
import {
  MANAGER_PROPOSALS_LOADER_ID,
  ManagerProposalsLoaderReturnType,
} from '@/lib/loaders';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import {
  useNavigate,
  useParams,
  useRevalidator,
  useRouteLoaderData,
} from 'react-router-dom';

export default function ProposalManagePage() {
  const { id: proposalId } = useParams();
  const proposals = useRouteLoaderData(
    MANAGER_PROPOSALS_LOADER_ID,
  ) as ManagerProposalsLoaderReturnType;

  const proposal = useRef(
    proposals.find(proposal => proposal.id === proposalId),
  );

  if (!proposal.current) {
    throw new Response('Proposal not found', { status: 404 });
  }

  const revalidator = useRevalidator();
  const navigate = useNavigate();

  const [dateSheetIsOpen, setDateSheetIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>(
    new Date(proposal.current.startDate),
  );
  const [endDate, setEndDate] = useState<Date>(
    new Date(proposal.current.endDate),
  );

  console.log(proposal.current);

  return (
    <div className="flex-col px-10 sm:px-20">
      <div className="flex justify-between">
        <h3 className="text-4xl font-bold">Dashboard</h3>
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {`${format(startDate, 'LLL dd, y')} - ${format(endDate, 'LLL dd, y')}`}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="flex w-auto flex-col items-center gap-2 p-0 pb-4"
              align="start"
            >
              <Calendar
                mode="range"
                selected={{
                  from: startDate,
                  to: endDate,
                }}
              />
              <Sheet open={dateSheetIsOpen} onOpenChange={setDateSheetIsOpen}>
                <SheetTrigger asChild>
                  <Button className="w-1/2">Edit Date</Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="flex w-full max-w-full items-center sm:w-3/4 sm:max-w-screen-sm"
                >
                  <CardWrapper
                    cardTitle="Edit Date"
                    cardDescription="Edit the start and end date"
                    className="w-full"
                  >
                    <DateForm
                      onSubmit={values => {
                        setStartDate(values.date.from);
                        setEndDate(values.date.to);
                        api.proposals.updateOne(proposalId!, {
                          startDate: values.date.from.toISOString(),
                          endDate: values.date.to.toISOString(),
                        });
                        setDateSheetIsOpen(false);
                      }}
                      defaultStartDate={startDate}
                      defaultEndDate={endDate}
                    />
                  </CardWrapper>
                </SheetContent>
              </Sheet>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
