import { z } from 'zod';
import { ExtendedFormProps, WithRequiredSubmit } from './interface';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import FormHandleButtons from './FormHandleButtons';

export type DateFormProps = WithRequiredSubmit<
  ExtendedFormProps<
    {
      date: {
        from: Date;
        to: Date;
      };
    },
    {
      defaultStartDate?: Date;
      defaultEndDate?: Date;
      submitButtonLabel?: string;
    }
  >
>;

const zodFormSchema = z.object({
  date: z
    .object({
      from: z.date({ message: 'Select a start date' }),
      to: z.date({ message: 'Select an end date' }),
    })
    .refine(data => data.from > addDays(new Date(), -1), {
      message: 'Start date must be set for a future date',
    }),
});

type FormValues = z.infer<typeof zodFormSchema>;

const DateForm: FC<DateFormProps> = ({
  defaultStartDate,
  defaultEndDate,
  onCancel,
  onSubmit,
  submitButtonLabel = 'Submit',
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(zodFormSchema),
    defaultValues: {
      date: {
        from: defaultStartDate,
        to: defaultEndDate,
      },
    },
  });

  return (
    <Form {...form}>
      <form className="flex max-w-sm flex-1 flex-col gap-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value?.from ? (
                        field.value.to ? (
                          `${format(field.value.from, 'LLL dd, y')} - ${format(field.value.to, 'LLL dd, y')}`
                        ) : (
                          format(field.value.from, 'LLL dd, y')
                        )
                      ) : (
                        <span>Pick the two dates</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={field.value?.from}
                      selected={field.value}
                      onSelect={field.onChange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormHandleButtons
          formSubmitLabel={submitButtonLabel}
          handleSubmitClick={form.handleSubmit(onSubmit)}
          handleCancelClick={onCancel}
        />
      </form>
    </Form>
  );
};

export default DateForm;
