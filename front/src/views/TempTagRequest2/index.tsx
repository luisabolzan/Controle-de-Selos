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
import { createTemporaryTagRequest } from "../../api/functions";

// import {createTempTagRequest2} from '../../api/functions'  

const TempTagRequest2 = () => {
    
    const location = useLocation();
    const name = (location.state as { name?: string } | null)?.name;
    const surname = (location.state as { surname?: string } | null)?.surname;
    const cnh = (location.state as { cnh?: string } | null)?.cnh;

    const [nameState, setName] = useState(name || '');
    const [surnameState, setSurname] = useState(surname || '');
    const [cnhState, setCnh] = useState(cnh || '');

    const [model, setModel] = useState('');
    const [color, setColor] = useState('');
    const [plate, setPlate] = useState('');

    const isMinWidth = useMediaQuery('(min-width: 1480px)');

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

    const isComplete = model && color && plate;

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
            const result = await createTemporaryTagRequest({
                driver: {
                    name: nameState,
                    surname: surnameState,
                    license_number: cnhState
                },
                vehicle: {
                    plate: plate,
                    model: model,
                    color: color
                }
            });

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
                    <h3>Indique os dados do veiculo associados a solicitação.</h3>
                </SubTitle>

                <FormContainer>           
                    <GenericForms
                        value= {{field1: model, field2: color, field3: plate}}
                        onChange={(newValues) => {
                            setModel(newValues.field1);
                            setColor(newValues.field2);
                            setPlate(newValues.field3);
                        }}
                        readOnly={false}
                        error={{field1: false, field2: false}} // Ajuste conforme os campos necessários
                        errorMessage={{field1: '', field2: '', field3:''}} // Ajuste conforme os campos necessários
                        title1="Modelo do Veículo"
                        title2="Cor do Veículo"
                        title3="Placa do Veículo"
                        placeholder1="Insira o modelo do veículo"
                        placeholder2="Insira a cor do veículo"
                        placeholder3="ABC1D23"
                    />
                </FormContainer>

                <ButtonContainer>
                    <GenericButton 
                        flexStatus="none" 
                        width="100%" 
                        height="60px" 
                        buttonType="Red" 
                        content={isLoading ? 'Enviando...' : 'Finalizar Solicitação'} 
                        onClick={handleSubmit} isDisabled={isLoading || !isComplete ? true : false}/>
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

export default TempTagRequest2;