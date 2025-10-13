import { Tag } from "lucide-react";
import React from "react";
import { useEffect, useState, useRef } from "react";

import {MainContainer, Separator, SubTitle, ServiceContainer, FormContainer, ButtonContainer} from "./styles";

import { useMediaQuery } from '../../hooks/useMediaQuery';
import { verifyDateRange } from '../../utils/validators'; 
import {sleep} from '../../utils/functions';

import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import GenericButton from "../../components/GenericButton";
import DateRangeSelector from '../../components/DateRangeSelector';
import SuccessToast from "../../components/Toast";

import { DateRangeValue, DateRangeError, DateRangeErrorMessage } from '../../components/DateRangeSelector/types';

import {createServiceTagRequest} from '../../api/functions'  

const ServiceTagRequest = () => {

    const isMinWidth = useMediaQuery('(min-width: 1480px)');

    const [dateRange, setDateRange] = useState<DateRangeValue>({
        start: new Date(), // default=datetime.now()
        end: null,
    });

    // Estados separados para os erros e mensagens
    const [errors, setErrors] = useState<DateRangeError>({ start: false, end: false });
    const [errorMessages, setErrorMessages] = useState<DateRangeErrorMessage>({ start: '', end: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    
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

    const handleDateChange = (newValue: DateRangeValue) => {
        // 1. Atualiza o valor da data
        setDateRange(newValue);
        
        // 2. Roda a verificação e atualiza os estados de erro
        const verification = verifyDateRange(newValue);
        setErrors(verification.errors);
        setErrorMessages(verification.errorMessages);
    };

    const handleSubmit = async () => {
        // Limpa erros antigos antes de tentar novamente
        setSubmitError(null);

        // 1. Validação do formulário no frontend
        const finalVerification = verifyDateRange(dateRange);
        if (finalVerification.errors.start || finalVerification.errors.end) {
            setErrors(finalVerification.errors);
            setErrorMessages(finalVerification.errorMessages);
            return; // Interrompe a função se houver erros de validação
        }
        
        console.log('Dados válidos! Enviando para o banco:', dateRange);
        setIsLoading(true); // Inicia o feedback de carregamento
        await sleep(1000);
        try {
            // ✨ 'await' espera a requisição terminar ✨
            const result = await createServiceTagRequest({
                startDate: dateToDdMmYyyy(dateRange.start), // Formato correto
                endDate: dateToDdMmYyyy(dateRange.end),   // Formato correto
                userId: 1, // Lembre-se de substituir pelo ID do usuário logado (useAuth)
            });

            resetToast();
            setShowToast(true);

            showTimeoutRef.current = setTimeout(() => setToastVisible(true), 50);
            hideTimeoutRef.current = setTimeout(() => setToastVisible(false), 3000);
            fullCloseTimeoutRef.current = setTimeout(() => {
            setShowToast(false);
            setToastType(null);
            }, 3500);

            setTimeout(() => {
                window.location.href = '/';
            }, 2000);

        } catch (error) {
            // ✨ O 'catch' agora vai funcionar corretamente ✨
            console.error('Falha ao criar a solicitação:', error);
            // Mostra uma mensagem de erro genérica para o usuário
            setErrorMessage('Ocorreu um erro ao enviar sua solicitação. Tente novamente.');
        
        } finally {
            // ✨ O bloco 'finally' sempre executa, com ou sem erro ✨
            setIsLoading(false); // Para o feedback de carregamento
        }
    };
    
    const dateToDdMmYyyy = (date: Date | null): string => {
    if (!date) return '';
    // Garante que o objeto Date seja tratado no fuso horário local corretamente
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
    };

    return(
        <ServiceContainer>
            <SideBar/>

            <MainContainer>
                <Header/>

                <Separator>
                    <h1> Solicitação de Selo de Serviço </h1>
                </Separator>

                <SubTitle>
                    <h3>Indique a data de retirada e  previsão de entrega do selo, <span style={{fontWeight: 400}}> se houver selos disponiveis no período desejado sua solicitação será aceita automaticamente e seu selo estará disponivel na aba “Meus selos’ </span> </h3>
                </SubTitle>

                <FormContainer>           
                    <DateRangeSelector
                        value={dateRange}
                        onChange={handleDateChange}
                        error={errors}
                        errorMessage={errorMessages}
                    />
                    <h6>{errorMessage}</h6>
                </FormContainer>

                <ButtonContainer>
                    <GenericButton width="100%" height="60px" buttonType="Red" content={isLoading ? 'Enviando...' : 'Solicitar Selo de Serviço'} onClick={handleSubmit} isDisabled={isLoading}/>
                </ButtonContainer>

                {showToast && (
                    <SuccessToast
                        message= "Solicitação Realizada"
                        description= "Verifique seu selo na aba 'Meus Selos'"
                        onClose={() => {
                            setToastVisible(false);
                            setTimeout(() => setShowToast(false), 1000);
                        }}
                        isVisible={toastVisible}
                    />
                )}

            </MainContainer>

        </ServiceContainer>
    );
};

export default ServiceTagRequest;