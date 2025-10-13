import { CloseButtonStyled } from './styles';
import { CloseButtonProps } from './types';
import { X } from 'lucide-react';

export default function CloseButton({ themeMode, disabled, onClick }: CloseButtonProps) {
  return (
    <CloseButtonStyled
      themeMode={themeMode}
      disabled={disabled}
      onClick={onClick}
      aria-label="Fechar"
    >
        <X width={16} height={16}/>
    </CloseButtonStyled>
  );
}
