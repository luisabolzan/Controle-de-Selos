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
import GenericForms2 from "../../components/GenericForms2";
import { GenericForms2Value } from '../../components/GenericForms2/types';

import { DateRangeValue, DateRangeError, DateRangeErrorMessage } from '../../components/DateRangeSelector/types';
import { Form } from "react-router-dom";

// import {createServiceTag} from '../../api/functions'  

const ServiceTagRegister = () => {

    const isMinWidth = useMediaQuery('(min-width: 1480px)');

    const [form, setForm] = useState<GenericForms2Value>({ number: '', type: '' });

    const options = [{
        value: 'Generico', label: 'Genérico' },
    ];

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

    const handleSubmit = async () => {
        // Limpa erros antigos antes de tentar novamente
        setSubmitError(null);
        
        setIsLoading(true); // Inicia o feedback de carregamento
        await sleep(1000);
        try {
            // 'await' espera a requisição terminar
            // const result = await createServiceTagRegister({
            //     startDate: dateToYyyyMmDd(dateRange.start),
            //     endDate: dateToYyyyMmDd(dateRange.end),
            // });

            //mostra toast de selo solicitado com sucesso
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
            console.error('Falha ao criar a solicitação:', error);
            // Mostra uma mensagem de erro genérica para o usuário
            setErrorMessage('Ocorreu um erro ao enviar sua solicitação. Tente novamente.');
        
        } finally {
            setIsLoading(false); // Para o feedback de carregamento
        }
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

                    <GenericForms2
                        value={form}
                        onChange={(next) => setForm(next)}
                        title1="Número do Selo"
                        title2="Tipo de Selo de Serviço"
                        placeholder1="Insira o número do selo aqui"
                        placeholder2="Selecione o tipo de selo aqui"
                        options={options}
                        error={{ number: false, type: false }}
                        errorMessage={{ number: '', type: '' }}
                    />

                </FormContainer>

                <ButtonContainer>
                    <GenericButton 
                        flexStatus="none" 
                        width="100%" 
                        height="60px" 
                        buttonType="Red" 
                        content={isLoading ? 'Enviando...' : 'Solicitar Selo de Serviço'} 
                        onClick={handleSubmit} isDisabled={isLoading}/>
                </ButtonContainer>

                {showToast && (
                    <SuccessToast
                        message= "Selo Criado com Sucesso"
                        description= "Verifique o selo na aba Selos de Serviço Cadastrados"
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

export default ServiceTagRegister;