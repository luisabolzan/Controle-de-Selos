export interface DateRangeValue {
  start: Date | null;
  end: Date | null;
}

export interface DateRangeError {
  start?: boolean;
  end?: boolean;
}

export interface DateRangeErrorMessage {
  start?: string;
  end?: string;
}

export interface DateRangeSelectorProps {
  /** Objeto contendo os valores das datas de início e fim. */
  value: DateRangeValue;
  /** Função chamada quando qualquer uma das datas é alterada. */
  onChange: (newValue: DateRangeValue) => void;
  /** Opcional. Desabilita ambos os inputs. */
  readOnly?: boolean;
  /** Opcional. Objeto para indicar qual campo está com erro. */
  error?: DateRangeError;
  /** Opcional. Objeto com as mensagens de erro para cada campo. */
  errorMessage?: DateRangeErrorMessage;
  /** Opcional. O texto do rótulo para a data inicial. */
  startLabel?: string;
  /** Opcional. O texto do rótulo para a data final. */
  endLabel?: string;
}