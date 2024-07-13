import { z } from 'zod';
import { ExtendedFormProps } from './interface';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CardForm from './CardForm';
import { Form, FormField, FormItem } from '../ui/form';

export type DateFormProps = ExtendedFormProps<{
  startDate: Date;
  endDate: Date;
}> & {
  defaultStartDate?: Date;
  defaultEndDate?: Date;
};

const zodFormSchema = z
  .object({
    startDate: z.date(),
    endDate: z.date(),
  })
  .refine(data => data.startDate < data.endDate, {
    message: 'Start date must be before end date',
  });

type FormValues = z.infer<typeof zodFormSchema>;

const DateForm: FC<DateFormProps> = ({
  defaultStartDate,
  defaultEndDate,
  onSubmit,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(zodFormSchema),
    defaultValues: {
      startDate: defaultStartDate,
      endDate: defaultEndDate,
    },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => {
            return <FormItem></FormItem>;
          }}
        ></FormField>
      </form>
    </Form>
  );
};

export default DateForm;
