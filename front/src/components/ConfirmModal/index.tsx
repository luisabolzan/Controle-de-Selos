import React from 'react';
import {
  Backdrop,
  ModalWrapper,
  Title,
  Message,
  ButtonGroup,
  ButtonWrapper,
  TopBar
} from './styles';
import { ConfirmModalProps } from './types';
import CloseButton from '../CloseButton';
import GnericButton from '../GenericButton';
const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <>
      <Backdrop onClick={onClose} />
      <ModalWrapper>
        <TopBar>
         <CloseButton themeMode="dark" onClick={onClose} />
        </TopBar>
        <Title>{title}</Title>
        <Message>{message}</Message>
     <ButtonGroup>
        <ButtonWrapper>
            <GnericButton
            buttonType="Transparent"
            content={cancelLabel}
            onClick={onClose}
            height="30px"
            fontSize="1em"
            fontWeight="800"
            flexStatus="1"
            $flex={true}
            />
        </ButtonWrapper>
        <ButtonWrapper>
            <GnericButton
            buttonType="Red"
            content={confirmLabel}
            onClick={onConfirm}
            height="30px"
            fontSize="1em"
            fontWeight="800"
            flexStatus="1"
            $flex={true}
            />
        </ButtonWrapper>
        </ButtonGroup>

      </ModalWrapper>
    </>
  );
};

export default ConfirmModal;
