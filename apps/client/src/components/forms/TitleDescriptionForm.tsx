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
import { Button } from '../ui/button';

export type TitleDescriptionFormProps = ExtendedFormProps<{
  title: string;
  description: string;
}> & {
  titleLabel?: string;
  descriptionLabel?: string;
  defaultTitle?: string;
  defaultDescription?: string;
};

const zodFormSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
});

type FormValues = z.infer<typeof zodFormSchema>;

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
        <Button type="submit" className="w-full">
          {formSubmitLabel}
        </Button>
        {onCancel && (
          <Button onClick={onCancel} type="button" className="w-full">
            Cancel
          </Button>
        )}
      </form>
    </Form>
  );
};

export default TitleDescriptionForm;
