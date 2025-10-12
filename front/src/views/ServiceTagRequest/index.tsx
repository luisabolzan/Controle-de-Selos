import { Tag } from "lucide-react";
import React from "react";
import { useEffect, useState, useRef } from "react";

import {MainContainer, Separator, SubTitle, ServiceContainer, FormContainer, ButtonContainer} from "./styles";

import { useMediaQuery } from '../../hooks/useMediaQuery';
import { verifyDateRange } from '../../utils/validators'; 

import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import GenericButton from "../../components/GenericButton";
import DateRangeSelector from '../../components/DateRangeSelector';

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

    const handleDateChange = (newValue: DateRangeValue) => {
        // 1. Atualiza o valor da data
        setDateRange(newValue);
        
        // 2. Roda a verificação e atualiza os estados de erro
        const verification = verifyDateRange(newValue);
        setErrors(verification.errors);
        setErrorMessages(verification.errorMessages);
    };

    const handleSubmit = () => {
        // Antes de enviar, faz uma última verificação
        const finalVerification = verifyDateRange(dateRange);
        if (finalVerification.errors.start || finalVerification.errors.end) {
        setErrorMessage("Formulário inválido. Verifique os campos.");
        setErrors(finalVerification.errors);
        setErrorMessages(finalVerification.errorMessages);
        return;
        }
        
        console.log('Dados válidos! Enviando para o banco:', dateRange);
        createServiceTagRequest({
            startDate: dateToDdMmYyyy(dateRange.start),
            endDate: dateToDdMmYyyy(dateRange.end),
            userId: 1, // Substitua pelo ID do usuário real
        });
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
                    <GenericButton width="100%" height="60px" buttonType="Red" content="Solicitar Selo de Serviço" onClick={handleSubmit}/>
                </ButtonContainer>

            </MainContainer>

        </ServiceContainer>
    );
};

export default ServiceTagRequest;