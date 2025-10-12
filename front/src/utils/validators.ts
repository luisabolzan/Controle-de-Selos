// Em um arquivo como: src/utils/validators.ts

import { DateRangeValue, DateRangeError, DateRangeErrorMessage } from '../components/DateRangeSelector/types';

interface VerificationResult {
  errors: DateRangeError;
  errorMessages: DateRangeErrorMessage;
}

/**
 * Verifica um intervalo de datas com base em regras de negócio.
 * @param value O objeto contendo as datas de início e fim.
 * @returns Um objeto com os erros e as mensagens de erro.
 */
export const verifyDateRange = (value: DateRangeValue): VerificationResult => {
  // Inicializa os objetos de retorno sem erros.
  const errors: DateRangeError = { start: false, end: false };
  const errorMessages: DateRangeErrorMessage = { start: '', end: '' };
  
  const { start: startDate, end: endDate } = value;

  // --- Prepara as datas para comparação (zerando o tempo para evitar problemas de fuso horário) ---
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const fiveDaysFromNow = new Date(today);
  fiveDaysFromNow.setDate(today.getDate() + 5);
  
  // --- Validação da Data de Retirada (startDate) ---
  if (startDate) {
    // Regra: a data de retirada não pode ser uma data anterior a data atual.
    if (startDate < today) {
      errors.start = true;
      errorMessages.start = 'A data de retirada não pode ser no passado.';
    }
    // Regra: a data de retirada não pode estar a mais de 5 dias de distancia da data atual
    else if (startDate > fiveDaysFromNow) {
      errors.start = true;
      errorMessages.start = 'A retirada deve ser em até 5 dias a partir de hoje.';
    }
  }

  // --- Validação do Intervalo (startDate vs endDate) ---
  if (startDate && endDate) {
    // Regra: a data de retirada precisa ser menor que ou igual a previsão de entrega.
    // Esta verificação só é feita se a data de início já não tiver outro erro.
    if (!errors.start && startDate > endDate) {
      errors.end = true;
      errorMessages.end = 'A entrega deve ser no mesmo dia ou após a retirada.';
    }
  }

  if (!startDate) {
    errors.start = true;
    errorMessages.start = 'A data de retirada é obrigatória.';
  }

  // Regra: a previsão de entrega precisa estar preenchida.
  if (!endDate) {
    errors.end = true;
    errorMessages.end = 'A previsão de entrega é obrigatória.';
  }

  return { errors, errorMessages };
};