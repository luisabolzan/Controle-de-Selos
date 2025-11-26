// Em um arquivo como: src/utils/validators.ts

import { DateRangeValue, DateRangeError, DateRangeErrorMessage } from '../components/DateRangeSelector/types';

interface VerificationResult {
  errors: DateRangeError;
  errorMessages: DateRangeErrorMessage;
}

/**
 * Verifica um intervalo de datas com base em regras de negócio.
 * @param value O objeto contendo as datas de início e fim.
 * @param enforceFiveDays Se true aplica a regra "start deve ser no máximo 5 dias a partir de hoje".
 * @returns Um objeto com os erros e as mensagens de erro.
 */
export const verifyDateRange = (value: DateRangeValue, enforceFiveDays: boolean = true): VerificationResult => {
  const errors: DateRangeError = { start: false, end: false };
  const errorMessages: DateRangeErrorMessage = { start: '', end: '' };

  const { start: startDate, end: endDate } = value;

  startDate?.setHours(0,0,0,0);
  endDate?.setHours(0,0,0,0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const fiveDaysFromNow = new Date(today);
  fiveDaysFromNow.setDate(today.getDate() + 5);

  // Validação da Data de Retirada (startDate)
  if (startDate) {
    if (startDate < today) {
      errors.start = true;
      errorMessages.start = 'A data de retirada não pode ser no passado.';
    }
    // Aplica apenas se enforceFiveDays for true
    else if (enforceFiveDays && startDate > fiveDaysFromNow) {
      errors.start = true;
      errorMessages.start = 'A retirada deve ser em até 5 dias a partir de hoje.';
    }
  }

  // Validação do Intervalo (startDate vs endDate)
  if (startDate && endDate) {
    if (!errors.start && startDate > endDate) {
      errors.end = true;
      errorMessages.end = 'A entrega deve ser no mesmo dia ou após a retirada.';
    }
  }

  if (!startDate) {
    errors.start = true;
    errorMessages.start = 'A data de retirada é obrigatória.';
  }

  if (!endDate) {
    errors.end = true;
    errorMessages.end = 'A previsão de entrega é obrigatória.';
  }

  return { errors, errorMessages };
};

interface ValidationResult {
  hasError: boolean;
  errorMessage: string;
}

export const validatePassword = (password: string): ValidationResult => {
  if (password.trim() === '') {
    return { hasError: false, errorMessage: '' };
  }

  if (password.length < 6) {
    return { hasError: true, errorMessage: 'A senha deve ter pelo menos 6 caracteres' };
  }

  if (!/[A-Z]/.test(password)) {
    return { hasError: true, errorMessage: 'A senha deve ter pelo menos uma letra maiúscula' };
  }

  if (!/[0-9]/.test(password)) {
    return { hasError: true, errorMessage: 'A senha deve ter pelo menos um número' };
  }

  if (!/[!@#$%^&*]/.test(password)) {
    return { hasError: true, errorMessage: 'A senha deve ter pelo menos um caractere especial' };
  }

  // Se passou por tudo, é válida
  return { hasError: false, errorMessage: '' };
};

