import styled from 'styled-components';

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

export const ModalWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 12px;
  padding: 24px;
  z-index: 1000;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  background-color: #D7D6D6;
  color: #000000;
  text-align: center;
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const Title = styled.p`
  margin-top: 0;
  font-weight: 800;
  font-size: 1.5em;
`;

export const Message = styled.p`
  margin: 16px 0;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  width: 100%;
`;

export const ButtonWrapper = styled.div`
  flex: 1;
`;


