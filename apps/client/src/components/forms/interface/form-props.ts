export interface FormProps<T> {
  formSubmitLabel?: string;
  formCancelLabel?: string;
  onSubmit: (values: T) => void;
  onCancel?: () => void;
}

export type ExtendedFormProps<
  T extends object = object,
  K extends object = object,
> = FormProps<T> & K;
