// src/components/DateRangeSelector/styles.ts

import styled from 'styled-components';

// ... (DateRangeContainer e DateInputSection permanecem os mesmos) ...
export const DateRangeContainer = styled.div`
  /* ... sem alterações ... */
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 40px; 
  width: 100%;
  height: auto;
  min-height: 200px;
  padding: 30px 40px;
  box-sizing: border-box;
  background-color: #C12A23;
  border-radius: 20px;
  font-family: 'Ubuntu', sans-serif;
  h5 {
    font-size: clamp(15px, 10px + 1.2vw, 25px);
    font-weight: 400;
    margin: 0;
    color: #FFFDFD;
  }
`;

export const DateInputSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 10px;
`;


export const InputFieldWrapper = styled.div<{ $error?: boolean }>`
  display: flex; /* Simplificado, não precisa mais de reverse */
  align-items: center;
  gap: 10px;

  background-color: #FFFFFF;
  border-radius: 100px;
  padding: 12px 20px;
  height: 50px;
  box-sizing: border-box;

  border: 1px solid ${(props) => (props.$error ? '#ff0d00ff' : 'transparent')};
  transition: border-color 0.2s ease-in-out;
`;

// Input agora é do tipo texto
export const DateInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background-color: transparent;
  font-family: 'Ubuntu', sans-serif;
  font-size: 16px;
  color: #333;
  width: 100%;

  /* Regra do seletor nativo não é mais necessária */
`;

export const ErrorMessage = styled.small`
  color: #FFFFFF;
  font-size: 14px;
  padding-left: 10px;
  min-height: 20px;
`;