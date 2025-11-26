import styled from 'styled-components';

export const FormsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  width: 100%;
  height: auto;
  min-height: 140px;
  padding: 30px 40px;
  box-sizing: border-box;
  background-color: #C12A23;
  border-radius: 20px;
  font-family: 'Ubuntu', sans-serif;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const FormRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

export const FieldSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  gap: 10px;
`;

export const Label = styled.h5`
  font-size: clamp(15px, 10px + 1.2vw, 25px);
  font-weight: 400;
  margin: 0;
  color: #FFFDFD;
`;

export const InputFieldWrapper = styled.div<{ $error?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;

  background-color: #FFFFFF;
  border-radius: 100px;
  padding: 8px 16px;
  height: 46px;
  box-sizing: border-box;

  border: 1px solid ${(props) => (props.$error ? '#ff0d00ff' : 'transparent')};
  transition: border-color 0.2s ease-in-out;
`;

export const TextInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background-color: transparent;
  font-family: 'Ubuntu', sans-serif;
  font-size: 15px;
  color: #333;
  width: 100%;
`;

export const Select = styled.select`
  flex: 1;
  border: none;
  outline: none;
  background-color: transparent;
  font-family: 'Ubuntu', sans-serif;
  font-size: 15px;
  color: #5e5d5dff;
  width: 100%;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
`;


export const ErrorMessage = styled.small`
  color: #FFFFFF;
  font-size: 14px;
  padding-left: 10px;
  min-height: 20px;
`;