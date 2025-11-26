import React, { useEffect, useState } from 'react';
import { GenericFormsProps, GenericFormsValue } from './types';
import {
  FormsContainer,
  FieldSection,
  InputFieldWrapper,
  TextInput,
  Label,
  ErrorMessage,
  FormRow,
} from './styles';

const GenericForms: React.FC<GenericFormsProps> = ({
  value,
  onChange,
  readOnly = false,
  title1 = 'Campo 1',
  title2 = 'Campo 2',
  title3 = 'Campo 3',
  placeholder1 = '',
  placeholder2 = '',
  placeholder3 = '',
  error,
  errorMessage,
}) => {
  const [v1, setV1] = useState(value?.field1 ?? '');
  const [v2, setV2] = useState(value?.field2 ?? '');
  const [v3, setV3] = useState(value?.field3 ?? '');

  useEffect(() => setV1(value?.field1 ?? ''), [value?.field1]);
  useEffect(() => setV2(value?.field2 ?? ''), [value?.field2]);
  useEffect(() => setV3(value?.field3 ?? ''), [value?.field3]);

  const handleChange = (field: keyof GenericFormsValue, next: string) => {
    if (field === 'field1') setV1(next);
    if (field === 'field2') setV2(next);
    if (field === 'field3') setV3(next);
    onChange?.({ field1: field === 'field1' ? next : v1, field2: field === 'field2' ? next : v2, field3: field === 'field3' ? next : v3 });
  };

  return (
    <FormsContainer>
        <FormRow>

            <FieldSection>
                <Label>{title1}</Label>
                <InputFieldWrapper $error={error?.field1}>
                <TextInput
                    type="text"
                    placeholder={placeholder1}
                    readOnly={readOnly}
                    value={v1}
                    onChange={(e) => handleChange('field1', e.target.value)}
                />
                </InputFieldWrapper>
                <ErrorMessage>{error?.field1 ? errorMessage?.field1 : ''}</ErrorMessage>
            </FieldSection>

            <FieldSection>
                <Label>{title2}</Label>
                <InputFieldWrapper $error={error?.field2}>
                <TextInput
                    type="text"
                    placeholder={placeholder2}
                    readOnly={readOnly}
                    value={v2}
                    onChange={(e) => handleChange('field2', e.target.value)}
                />
                </InputFieldWrapper>
                <ErrorMessage>{error?.field2 ? errorMessage?.field2 : ''}</ErrorMessage>
            </FieldSection>
            
        </FormRow>

        <FieldSection>
                <Label>{title3}</Label>
                <InputFieldWrapper $error={error?.field3}>
                <TextInput
                    type="text"
                    placeholder={placeholder3}
                    readOnly={readOnly}
                    value={v3}
                    onChange={(e) => handleChange('field3', e.target.value)}
                />
                </InputFieldWrapper>
                <ErrorMessage>{error?.field3 ? errorMessage?.field3 : ''}</ErrorMessage>
        </FieldSection>
    </FormsContainer>
  );
};

export default GenericForms;