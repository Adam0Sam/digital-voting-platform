import { User } from '@/types';
import { ExtendedFormProps } from './interface';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '../ui/form';

type FormValues = { owner: User; managers: User[] };
export type UserSelectionFormProps = ExtendedFormProps<FormValues>;

const UserSelectionForm: FC<UserSelectionFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const form = useForm<FormValues>();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}></form>
    </Form>
  );
};

export default UserSelectionForm;
