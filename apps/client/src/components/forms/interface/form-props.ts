export interface FormProps<T> {
  formCardTitle: string;
  formCardDescription?: string;
  formSubmitLabel?: string;
  formCancelLabel?: string;
  onSubmit: (values: T) => void;
  onCancel?: () => void;
}

export type ExtendedFormProps<T extends object = object> = FormProps<T>;
