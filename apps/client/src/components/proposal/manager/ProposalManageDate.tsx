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
import { Proposal } from '@/lib/types';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

export default function ProposalManageDate({
  proposal,
  canEdit,
}: {
  proposal: Proposal;
  canEdit: boolean;
}) {
  const [dateSheetIsOpen, setDateSheetIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>(
    new Date(proposal.startDate),
  );
  const [endDate, setEndDate] = useState<Date>(new Date(proposal.endDate));
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className="w-full justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <p className="hidden sm:block">
            {`${format(startDate, 'LLL dd, y')} - ${format(endDate, 'LLL dd, y')}`}
          </p>
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
          {canEdit && (
            <SheetTrigger asChild>
              <Button className="w-1/2">Edit Date</Button>
            </SheetTrigger>
          )}
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
                  api.proposals.updateOne(proposal.id, {
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
  );
}
