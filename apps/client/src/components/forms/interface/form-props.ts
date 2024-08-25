import { WithRequired } from '@/lib/types/utils/util-types';

export interface FormProps<T> {
  formSubmitLabel?: string;
  formCancelLabel?: string;
  onSubmit?: (values: T) => void;
  onCancel?: () => void;
  disableSubmit?: boolean;
  disableCancel?: boolean;
}

export type ExtendedFormProps<
  T extends object = object,
  K extends object = object,
> = FormProps<T> & K;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithRequiredSubmit<T extends FormProps<any>> = WithRequired<
  T,
  'onSubmit'
>;
