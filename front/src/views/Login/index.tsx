import React from "react";
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { LoginContainer, ImageStyle, LoginForm, HeaderForm, UsernameIpunt, DomainBox, InputsContainer, TextContainer, AltOptions} from "./styles";

import logoINF from '../../assets/logo-INF-Black.png';

import PasswordInput from "../../components/PasswordInput";
import BasicInput from "../../components/BasicInput";

import { validatePassword } from "../../utils/validators";
import { User } from "lucide-react";
import ActionText from "../../components/ActionText";
import GenericButton from "../../components/GenericButton";
import SuccessToast from "../../components/Toast";

import { authenticateUser } from "../../api/functions";


export const Login: React.FC = () => {

    const [user, setUser] = useState('');

    const location = useLocation();
    const fromSignUp = (location.state as { fromSignUp?: boolean } | null)?.fromSignUp || false;

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const fullCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [toastType, setToastType] = useState< "excluir" | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);

    const resetToast = () => {
        setToastVisible(false);

        if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        if (fullCloseTimeoutRef.current) clearTimeout(fullCloseTimeoutRef.current);

        setShowToast(false);
        setToastType(null);
    };

    useEffect(() => {
        if (fromSignUp) {
            setShowToast(true);
            setToastVisible(true);
        }
    }, [fromSignUp]);

    const verifyPassword = (password: string) => {
        
        const result = validatePassword(password);
        setPasswordError(result.hasError);
        setPasswordErrorMessage(result.errorMessage);
    }

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(false);
        setErrorMessage('');

        try{
            const response = await authenticateUser(user, password);
            localStorage.setItem('isAdmin', response.isAdmin);            
            
            setError(false);
            setPassword("")
            navigate("/tagRequest")
        } catch (error) {
            setError(true);
            setErrorMessage("Falha na autenticação. Verifique seu usuário e senha.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <LoginContainer>
            
            <ImageStyle src={logoINF} alt="Logo INF" />

            <LoginForm>

                <HeaderForm>
                    <h1>Fazer Login</h1>
                    {error ? errorMessage : <h4>Bem-vindo ao Sistema de Controle de Selos do INF <br/> Por favor, faça o login para continuar  </h4> }
                </HeaderForm>
                
                <InputsContainer>
                    <UsernameIpunt>

                        <BasicInput
                            title=""
                            required={true}
                            $fontSize="1rem" 
                            placeholder="Login (ex: agbarcellos)"
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
                        } }
                        error={passwordError}
                        errorMessage={passwordErrorMessage} 
                        visible={false}
                        showError={false}
                    />
                </InputsContainer>

                <GenericButton 
                    flexStatus="none" 
                    width="100%" 
                    height="41px" 
                    buttonType="Red" 
                    content={isLoading ? 'Enviando...' : 'Fazer Login'} 
                    onClick={handleSubmit} 
                    isDisabled={isLoading}
                    fontSize="20px"
                />
                
                <AltOptions>

                    <ActionText
                        key={"forgotPasswordActionText"}
                        width="100%"
                        fontSize="1rem"
                        textColor="#553525"
                        onClick={() => navigate("/")}
                    >
                    <h2>Esqueci minha senha</h2>

                    </ActionText>

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
                        onClick={() => navigate("/")}
                    >
                    <h2>Criar Conta</h2>

                    </ActionText>

                </AltOptions>

            </LoginForm>

            {showToast && (
                <SuccessToast
                    message= "Cadastro realizado com sucesso!"
                    description= "Faça o login para continuar"
                    onClose={() => {
                        setToastVisible(false);
                        setTimeout(() => setShowToast(false), 1000);
                    }}
                    isVisible={toastVisible}
                />
            )}

        </LoginContainer>
    );
}

export default Login;