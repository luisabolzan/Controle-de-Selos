import { Tag } from "lucide-react";
import React from "react";
import { useEffect, useState, useRef } from "react";

import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

import {MainContainer, Separator, SubTitle, ServiceContainer, FormContainer, ButtonContainer} from "./styles";

import { useMediaQuery } from '../../hooks/useMediaQuery';
import { verifyDateRange } from '../../utils/validators'; 
import {sleep} from '../../utils/functions';

import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import GenericButton from "../../components/GenericButton";
import DateRangeSelector from '../../components/DateRangeSelector';
import SuccessToast from "../../components/Toast";
import GenericForms from "../../components/GenericForms";

import { DateRangeValue, DateRangeError, DateRangeErrorMessage } from '../../components/DateRangeSelector/types';

// import {createTempTagRequest} from '../../api/functions'  

const TempTagRequest = () => {
    
    const location = useLocation();

    const isMinWidth = useMediaQuery('(min-width: 1480px)');

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [cnh, setCnh] = useState('');

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

    };

    const navigate = useNavigate();

    return(
        <ServiceContainer>
            <SideBar/>

            <MainContainer>
                <Header/>

                <Separator>
                    <h1> Solicitação de Credencial Provisória </h1>
                </Separator>

                <SubTitle>
                    <h3>Indique os dados do condutor associados a solicitação.</h3>
                </SubTitle>

                <FormContainer>           
                    <GenericForms
                        value= {{field1: name, field2: surname, field3: cnh}}
                        onChange={(newValues) => {
                            setName(newValues.field1);
                            setSurname(newValues.field2);
                            setCnh(newValues.field3);
                        }}
                        readOnly={false}
                        error={{field1: false, field2: false}} // Ajuste conforme os campos necessários
                        errorMessage={{field1: '', field2: '', field3:''}} // Ajuste conforme os campos necessários
                        title1="Nome do Condutor"
                        title2="Sobrenome do Condutor"
                        title3="CNH do Condutor"
                        placeholder1="Insira o nome do condutor"
                        placeholder2="Insira o sobrenome do condutor"
                        placeholder3="Insira a CNH do condutor"
                    />
                </FormContainer>

                <ButtonContainer>
                    
                    <GenericButton 
                        flexStatus="none" 
                        width="100%" 
                        height="60px" 
                        buttonType="Red" 
                        content="Próximo" 
                        onClick={() => navigate('/temp2', {state: {name, surname, cnh }})}
                        isDisabled={name && surname && cnh ? false : true}/>
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

export default TempTagRequest;