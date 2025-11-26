export interface GenericFormsValue {
  field1: string;
  field2: string;
  field3: string;
}

export interface GenericFormsError {
  field1?: boolean;
  field2?: boolean;
  field3?: boolean;
}

export interface GenericFormsErrorMessage {
  field1?: string;
  field2?: string;
  field3?: string;
}

export interface GenericFormsProps {
  value: GenericFormsValue;
  onChange?: (next: GenericFormsValue) => void;
  readOnly?: boolean;

  // Labels / placeholders
  title1?: string;
  title2?: string;
  title3?: string;

  placeholder1?: string;
  placeholder2?: string;
  placeholder3?: string;

  // optional error props similar to DateRangeSelector
  error?: GenericFormsError;
  errorMessage?: GenericFormsErrorMessage;
}