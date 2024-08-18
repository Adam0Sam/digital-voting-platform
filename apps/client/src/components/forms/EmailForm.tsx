import { z } from 'zod';
import { ExtendedFormProps } from './interface';
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
import { Input } from '../ui/input';
import FormHandleButtons from './FormHandleButtons';
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';

const zodFormSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
});
type FormValues = z.infer<typeof zodFormSchema>;

const formStyleVariants = cva('flex max-w-sm flex-1 gap-4', {
  variants: {
    direction: {
      horizontal: 'flex-row items-center ',
      vertical: 'flex-col',
    },
  },
  defaultVariants: {
    direction: 'vertical',
  },
});

export type EmailFormProps = ExtendedFormProps<
  FormValues,
  {
    className?: string;
    defaultEmail: string | null;
    direction?: VariantProps<typeof formStyleVariants>['direction'];
  }
>;

const EmailForm: FC<EmailFormProps> = ({
  onSubmit,
  defaultEmail,
  className,
  disableSubmit,
  direction,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(zodFormSchema),
    defaultValues: {
      email: defaultEmail ? defaultEmail : '',
    },
  });

  return (
    <Form {...form}>
      <form className={cn(formStyleVariants({ direction }), className)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Your email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormHandleButtons
          handleSubmitClick={form.handleSubmit(onSubmit)}
          enableSubmit={!disableSubmit}
        />
      </form>
    </Form>
  );
};

export default EmailForm;
