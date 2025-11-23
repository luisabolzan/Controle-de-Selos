import React from 'react';

import { PasswordContainer, StyledInput } from './styles';
import { PasswordInputProps } from './types';

import { Eye, EyeOff, CircleAlert } from 'lucide-react';

function PasswordInput({
  title,
  required,
  $fontSize,
  placeholder,
  $width,
  value,
  onChange,
  onClick,
  onKeyDown,
  $paddingRight = '24px',
  $readOnly = false,
  $inputType = 'Primário',
  error = false,
  errorMessage,
  isDisabled,
  showError,
}: PasswordInputProps) {
  const [visible, setVisible] = React.useState(false);

  const inputType = visible && !isDisabled ? 'text' : 'password';

  return (
    <PasswordContainer>
      {title && (
        <label
          style={{
            fontFamily: 'ubuntu, sans-serif',
            fontSize: $fontSize,
            fontWeight: 700,
            color: '#000000',
            marginBottom: '8px',
            opacity: isDisabled ? 0.3 : 1,
            
          }}
        >
          {title}
          {required && <span style={{ color: '#F17D6E' }}> *</span>}
        </label>
      )}

      <div
        style={{
          width: $width,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <StyledInput
          disabled={isDisabled}
          $readOnly={$readOnly || isDisabled}
          $width={$width}
          type={isDisabled ? undefined : inputType}
          value={isDisabled ? undefined : value}
          onChange={isDisabled ? undefined : onChange}
          placeholder={placeholder}
          $fontSize={$fontSize}
          onClick={isDisabled ? undefined : onClick}
          onKeyDown={isDisabled ? undefined : onKeyDown}
          $paddingRight={$paddingRight}
          $inputType={$inputType}
          $error={error}
          style={{ opacity: isDisabled ? 0.3 : 1, cursor: isDisabled ? 'not-allowed' : 'auto' }}
        />

        <div
          style={{
            position: 'absolute',
            right: '1.25em', // 20px / 16px (base font size) = 1.25em
            top: '50%',
            transform: 'translateY(-50%)',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            opacity: isDisabled ? 0.3 : 1,
          }}
        >
          {visible && !isDisabled ? (
            <EyeOff color="#000000" size={20} onClick={() => setVisible(false)} />
          ) : (
            <Eye color="#000000" size={20} onClick={isDisabled ? undefined : () => setVisible(true)} />
          )}
        </div>
      </div>

      {showError &&
      
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375em',
            // O segredo está aqui:
            visibility: error && errorMessage ? 'visible' : 'hidden',
            // Opcional: define uma altura mínima para garantir que não colapse se a string for vazia
            minHeight: `calc(${$fontSize} + 0.25em)`, 
          }}
        >
          <CircleAlert 
            color="#FF3B30" 
            size={`calc(${$fontSize} - 0.125em)`} 
          />

          <span
            role="alert" /* Importante para acessibilidade */
            style={{
              color: '#FF3B30',
              fontSize: `calc(${$fontSize} - 0.125em)`,
              fontWeight: 500,
              fontFamily: 'Nunito Sans, sans-serif',
              // Garante que o span tenha altura de linha mesmo sem texto visível (se necessário)
              lineHeight: 1.5 
            }}
          >
            {/* Se não houver mensagem, usamos um espaço em branco para manter a altura da linha */}
            {errorMessage || '\u00A0'} 
          </span>
        </div>

    }

    </PasswordContainer>
  );
}

export default PasswordInput;