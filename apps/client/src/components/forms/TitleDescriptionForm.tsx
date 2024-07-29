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
import { ExtendedFormProps } from './interface';
import { Input } from '../ui/input';
import { FC } from 'react';
import FormHandleButtons from './FormHandleButtons';

const zodFormSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  // description: z.string().min(1, { message: 'Description is required' }),
  description: z.string().optional(),
});
type FormValues = z.infer<typeof zodFormSchema>;

export type TitleDescriptionFormProps = ExtendedFormProps<
  FormValues,
  {
    titleLabel?: string;
    descriptionLabel?: string;
    defaultTitle?: string;
    defaultDescription?: string;
  }
>;

const TitleDescriptionForm: FC<TitleDescriptionFormProps> = ({
  formSubmitLabel = 'Submit',
  titleLabel = 'Form Title',
  descriptionLabel = 'Form Description',
  defaultTitle = '',
  defaultDescription = '',
  onCancel,
  onSubmit,
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
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
                  <Input
                    placeholder={`Your ${descriptionLabel}`}
                    type="text"
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
          handleCancelClick={onCancel}
        />
      </form>
    </Form>
  );
};

export default TitleDescriptionForm;