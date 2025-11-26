import { Tag } from "lucide-react";
import React from "react";
import { useEffect, useState, useRef } from "react";

import { useNavigate } from "react-router-dom";

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

// import {createEventualTagRequest} from '../../api/functions'  

const EventualTagRequest = () => {

    const isMinWidth = useMediaQuery('(min-width: 1480px)');

    const [dateRange, setDateRange] = useState<DateRangeValue>({
        start: new Date(), // default=datetime.now()
        end: null,
    });

    // Estados separados para os erros e mensagens
    const [errors, setErrors] = useState<DateRangeError>({ start: true, end: true });
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
        const verification = verifyDateRange(newValue, true);
        setErrors(verification.errors);
        setErrorMessages(verification.errorMessages);
    };

    const handleSubmit = async () => {

    };

    const dateToYyyyMmDd = (date: Date | null): string => {
        if (!date) return '';
        // toISOString() retorna "2025-10-13T...". O split('T')[0] pega apenas a parte da data.
        return date.toISOString().split('T')[0];
    };

    const navigate = useNavigate();

    return(
        <ServiceContainer>
            <SideBar/>

            <MainContainer>
                <Header/>

                <Separator>
                    <h1> Solicitação de Liberação Eventual </h1>
                </Separator>

                <SubTitle>
                    <h3>Indique a data de retirada e  previsão de término da liberação <span style={{fontWeight: 400}}> Atenção: a retirada deve ser em até 5 dias a partir de hoje. </span> </h3>
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
                    <GenericButton 
                        flexStatus="none" 
                        width="100%" 
                        height="60px" 
                        buttonType="Red" 
                        content="Próximo"   
                        onClick={() => navigate("/eventual2", { state: { dateRange } })}
                        isDisabled={errors.start || errors.end}
                    />
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

export default EventualTagRequest;