// src/components/DateRangeSelector/index.tsx

import React, { useState, useEffect } from 'react';
import { DateRangeSelectorProps } from './types';
import {
  DateRangeContainer,
  DateInputSection,
  InputFieldWrapper,
  DateInput,
  ErrorMessage,
} from './styles';
import { Calendar } from 'lucide-react';

// --- Funções Auxiliares ---

// Converte um objeto Date para uma string 'DD/MM/YYYY' para exibição
const dateToDdMmYyyy = (date: Date | null): string => {
  if (!date) return '';
  // Garante que o objeto Date seja tratado no fuso horário local corretamente
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Converte uma string 'DD/MM/YYYY' para um objeto Date, com validação
const parseDdMmYyyy = (str: string): Date | null => {
  if (str.length !== 10) return null;

  const parts = str.split('/');
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Mês no JS é 0-indexed
  const year = parseInt(parts[2], 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

  const date = new Date(year, month, day);

  // Validação crucial: verifica se a data criada corresponde aos valores de entrada
  // Isso pega datas inválidas como 30/02/2025
  if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
    return date;
  }

  return null;
};


const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  value,
  onChange,
  readOnly = false,
  error,
  errorMessage,
  startLabel = 'Data de Retirada',
  endLabel = 'Data de Entrega',
}) => {
  // Estados internos para as strings que o usuário vê e digita
  const [startString, setStartString] = useState(dateToDdMmYyyy(value.start));
  const [endString, setEndString] = useState(dateToDdMmYyyy(value.end));

  // Sincroniza o estado interno se a prop 'value' mudar externamente
  useEffect(() => {
    setStartString(dateToDdMmYyyy(value.start));
  }, [value.start]);

  useEffect(() => {
    setEndString(dateToDdMmYyyy(value.end));
  }, [value.end]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'start' | 'end'
  ) => {
    // 1. Lógica da Máscara
    const rawValue = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    let maskedValue = rawValue;
    if (rawValue.length > 2) {
      maskedValue = `${rawValue.slice(0, 2)}/${rawValue.slice(2)}`;
    }
    if (rawValue.length > 4) {
      maskedValue = `${rawValue.slice(0, 2)}/${rawValue.slice(2, 4)}/${rawValue.slice(4, 8)}`;
    }

    // 2. Atualiza o estado da string interna
    if (field === 'start') {
      setStartString(maskedValue);
    } else {
      setEndString(maskedValue);
    }

    // 3. Valida e chama o onChange do pai com um objeto Date
    const newDate = parseDdMmYyyy(maskedValue);
    if (maskedValue.length === 10) { // Só propaga a mudança se a data estiver completa
        onChange({ ...value, [field]: newDate });
    } else if (maskedValue.length === 0) { // Permite limpar o campo
        onChange({ ...value, [field]: null });
    }
  };

  return (
    <DateRangeContainer>
      {/* Seção da Data Inicial */}
      <DateInputSection>
        <h5>{startLabel}</h5>
        <InputFieldWrapper $error={error?.start}>
          <Calendar color="#000000" size={20} />
          <DateInput
            type="text" // Agora é um input de texto
            placeholder="DD/MM/AAAA"
            readOnly={readOnly}
            value={startString}
            onChange={(e) => handleInputChange(e, 'start')}
            maxLength={10}
          />
        </InputFieldWrapper>
        <ErrorMessage>
          {error?.start ? errorMessage?.start : ''}
        </ErrorMessage>
      </DateInputSection>

      {/* Seção da Data Final */}
      <DateInputSection>
        <h5>{endLabel}</h5>
        <InputFieldWrapper $error={error?.end}>
          <Calendar color="#000000" size={20} />
          <DateInput
            type="text"
            placeholder="DD/MM/AAAA"
            readOnly={readOnly}
            value={endString}
            onChange={(e) => handleInputChange(e, 'end')}
            maxLength={10}
          />
        </InputFieldWrapper>
        <ErrorMessage>
          {error?.end ? errorMessage?.end : ''}
        </ErrorMessage>
      </DateInputSection>
    </DateRangeContainer>
  );
};

export default DateRangeSelector;