import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { ExtendedFormProps, WithRequiredSubmit } from './interface';
import { Input } from '../ui/input';
import { FC } from 'react';
import FormHandleButtons from './FormHandleButtons';
import { Textarea } from '../ui/textarea';
import { cn } from '@/lib/utils';

const zodFormSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().optional(),
});
type FormValues = z.infer<typeof zodFormSchema>;

export type TitleDescriptionFormProps = WithRequiredSubmit<
  ExtendedFormProps<
    FormValues,
    {
      titleLabel?: string;
      titleEditDisabled?: boolean;
      descriptionLabel?: string;
      descriptionEditDisabled?: boolean;
      defaultTitle?: string;
      defaultDescription?: string;
      className?: string;
    }
  >
>;

const TitleDescriptionForm: FC<TitleDescriptionFormProps> = ({
  formSubmitLabel = 'Submit',
  titleLabel = 'Form Title',
  descriptionLabel = 'Form Description',
  defaultTitle = '',
  defaultDescription = '',
  onCancel,
  onSubmit,
  disableSubmit,
  disableCancel,
  titleEditDisabled,
  descriptionEditDisabled,
  className,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(zodFormSchema),
    // defaultValues: defaultValues,
    defaultValues: {
      title: defaultTitle,
      description: defaultDescription,
    },
  });

  return (
    <Form {...form}>
      <form className={cn('flex max-w-sm flex-1 flex-col gap-4', className)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>{titleLabel}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={`Your ${titleLabel}`}
                    type="text"
                    disabled={titleEditDisabled}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>{descriptionLabel}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={`Your ${descriptionLabel}`}
                    disabled={descriptionEditDisabled}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormHandleButtons
          formSubmitLabel={formSubmitLabel}
          handleSubmitClick={form.handleSubmit(onSubmit)}
          handleCancelClick={onCancel}
          enableSubmit={!disableSubmit}
          enableCancel={!disableCancel}
        />
      </form>
    </Form>
  );
};

export default TitleDescriptionForm;
