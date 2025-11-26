import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { SignUpContainer, ImageStyle, SignUpForm, HeaderForm, UsernameIpunt, DomainBox, InputsContainer, TextContainer, AltOptions} from "./styles";

import logoINF from '../../assets/logo-INF-Black.png';

import PasswordInput from "../../components/PasswordInput";
import BasicInput from "../../components/BasicInput";

import { validatePassword } from "../../utils/validators";
import { User } from "lucide-react";
import ActionText from "../../components/ActionText";
import GenericButton from "../../components/GenericButton";
import { sleep } from "../../utils/functions";

import { authenticateUser, registerUser } from "../../api/functions";

export const SignUp: React.FC = () => {

    const [user, setUser] = useState('');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('');

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const verifyPassword = (password: string) => {
        
        const result = validatePassword(password);
        setPasswordError(result.hasError);
        setPasswordErrorMessage(result.errorMessage);
    }

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        await sleep(500);
        setError(false);
        setErrorMessage('');

        try{
            const response = await registerUser(user, password);
            setError(false);
            setPassword("")
            setConfirmPassword("")
            navigate("/login", { state: { fromSignUp: true} });
        } catch (error) {
            setError(true);
            setErrorMessage("Falha no cadastro. Verifique seus dados e tente novamente.");
        } finally {
            setIsLoading(false);
        }
    }

    const verifyConfirmPassword = (confirmPassword: string) => {

    if (confirmPassword.trim() === '') {
        setConfirmPasswordError(false);
        setConfirmPasswordErrorMessage('');
        return;
    }
    if (confirmPassword !== password) {
        setConfirmPasswordError(true);
        setConfirmPasswordErrorMessage('As senhas não coincidem');
    } else {
        setConfirmPasswordError(false);
        setConfirmPasswordErrorMessage('');
    }

  };

    return (
        <SignUpContainer>
            
            <ImageStyle src={logoINF} alt="Logo INF" />

            <SignUpForm>

                <HeaderForm>
                    <h1>Cadastre-se</h1>
                    {error ? errorMessage : <h4>Insira seu e-mail @inf e crie uma senha para sua conta </h4> }
                </HeaderForm>
                
                <InputsContainer>
                    <UsernameIpunt>

                        <BasicInput
                            title=""
                            required={true}
                            $fontSize="1rem" 
                            placeholder="SignUp (ex: agbarcellos)"
                            $width="100%"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                        />
                    
                        <DomainBox
                            $paddingRight = '24px'
                            $width="30%"
                            $fontSize="1rem"
                        >
                            <h5> @inf.ufrgs.br </h5>

                        </DomainBox>
                    </UsernameIpunt>

                    <PasswordInput
                        title=""
                        required={true}
                        isDisabled={false}
                        $fontSize="1rem" 
                        placeholder="Insira sua senha aqui"
                        $width="100%"
                        value={password}
                            onChange={(e) => {
                        setPassword(e.target.value);
                        verifyPassword(e.target.value);
                        } }
                        error={passwordError}
                        errorMessage={passwordErrorMessage} 
                        visible={false}
                        showError={true}
                    />

                    <PasswordInput
                        title=""
                        required={true}
                        isDisabled={false}
                        $fontSize="1rem" 
                        placeholder="Confirme sua senha aqui"
                        $width="100%"
                        value={confirmPassword}
                            onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        verifyConfirmPassword(e.target.value);
                        } }
                        error={confirmPasswordError}
                        errorMessage={confirmPasswordErrorMessage} 
                        visible={false}
                        showError={true}
                    />
                </InputsContainer>

                <GenericButton 
                    flexStatus="none" 
                    width="100%" 
                    height="41px" 
                    buttonType="Red" 
                    content={isLoading ? 'Enviando...' : 'Criar Conta'} 
                    onClick={handleSubmit} 
                    isDisabled={isLoading || passwordError || confirmPasswordError || password === '' || confirmPassword === '' || user === ''}
                    fontSize="20px"
                />
                    
                <AltOptions>

                    <TextContainer>
                        <div />
                        <h2>Ou</h2>
                        <div />
                    </TextContainer>

                    <ActionText
                        key={"forgotPasswordActionText"}
                        width="100%"
                        fontSize="1rem"
                        textColor="#553525"
                        onClick={() => navigate("/login")}
                    >
                    <h2>Fazer Login</h2>

                    </ActionText>

                </AltOptions>

            </SignUpForm>

        </SignUpContainer>
    );
}

export default SignUp;