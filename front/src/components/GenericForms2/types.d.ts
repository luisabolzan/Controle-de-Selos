export interface GenericForms2Value {
  number: string;
  type: string;
}

export interface GenericForms2Error {
  number?: boolean;
  type?: boolean;
}

export interface GenericForms2ErrorMessage {
  number?: string;
  type?: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface GenericForms2Props {
  value: GenericForms2Value;
  onChange?: (next: GenericForms2Value) => void;
  readOnly?: boolean;

  title1?: string;
  title2?: string;

  placeholder1?: string;
  placeholder2?: string;

  options?: SelectOption[];

  error?: GenericForms2Error;
  errorMessage?: GenericForms2ErrorMessage;
}