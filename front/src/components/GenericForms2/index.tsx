import React, { useEffect, useState } from 'react';
import { GenericForms2Props, GenericForms2Value } from './types';
import {
  FormsContainer,
  FormRow,
  FieldSection,
  Label,
  InputFieldWrapper,
  TextInput,
  Select,
  ErrorMessage,
} from './styles';

const GenericForms2: React.FC<GenericForms2Props> = ({
  value,
  onChange,
  readOnly = false,
  title1 = 'Numero do Selo',
  title2 = 'Tipo de Selo de Serviço',
  placeholder1 = 'Insira o numero do selo aqui',
  placeholder2 = 'Selecione o tipo de selo aqui',
  options = [],
  error,
  errorMessage,
}) => {
  const [num, setNum] = useState<string>(value?.number ?? '');
  const [type, setType] = useState<string>(value?.type ?? '');

  useEffect(() => setNum(value?.number ?? ''), [value?.number]);
  useEffect(() => setType(value?.type ?? ''), [value?.type]);

  const handleChange = (next: Partial<GenericForms2Value>) => {
    const newValue: GenericForms2Value = {
      number: next.number !== undefined ? next.number : num,
      type: next.type !== undefined ? next.type : type,
    };
    if (next.number !== undefined) setNum(next.number);
    if (next.type !== undefined) setType(next.type);
    onChange?.(newValue);
  };

  return (
    <FormsContainer>
      <FormRow>
        <FieldSection>
          <Label>{title1}</Label>
          <InputFieldWrapper $error={error?.number}>
            <TextInput
              type="text"
              placeholder={placeholder1}
              readOnly={readOnly}
              value={num}
              onChange={(e) => handleChange({ number: e.target.value })}
            />
          </InputFieldWrapper>
          <ErrorMessage>{error?.number ? errorMessage?.number : ''}</ErrorMessage>
        </FieldSection>

        <FieldSection>
          <Label>{title2}</Label>
          <InputFieldWrapper $error={error?.type}>
            <Select
              value={type}
              onChange={(e) => handleChange({ type: e.target.value })}
              disabled={readOnly}
              aria-label={title2}
            >
              <option value="">{placeholder2}</option>
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </InputFieldWrapper>
          <ErrorMessage>{error?.type ? errorMessage?.type : ''}</ErrorMessage>
        </FieldSection>
      </FormRow>
    </FormsContainer>
  );
};

export default GenericForms2;