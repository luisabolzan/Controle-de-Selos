import { Tag } from "lucide-react";
import React from "react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {ButtonWrapper, ButtonsContainer, InfoContainer, Info, MainContainer, Separator, SubTitle, TagRequestContainer} from "./styles";

import { useMediaQuery } from '../../hooks/useMediaQuery';

import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import GenericButton from "../../components/GenericButton";

const TagRequest = () => {

    const isMinWidth = useMediaQuery('(min-width: 1480px)');

    const navigate = useNavigate();

    const handleUserAction = (selected: string) => {
        if (selected === "Selo de Serviço") navigate("/service");
        if (selected === "Liberação Eventual") navigate("/eventual");
        if (selected === "Credencial Provisória") navigate("/temp");
    };

    const currentUserOptions = ["Selo de Serviço", "Liberação Eventual", "Credencial Provisória"];

    const currentUserActions = handleUserAction;

    return(
        <TagRequestContainer>
            <SideBar/>

            <MainContainer>
                <Header/>

                <Separator>
                    <h1> Nova Solicitação </h1>
                </Separator>

                <SubTitle>
                    <h3>Selecione o tipo de selo que você deseja</h3>
                </SubTitle>

                <ButtonsContainer>
                    <ButtonWrapper>
                        <GenericButton width="100%" height="60px" buttonType="Red" content={currentUserOptions[0]} key={currentUserOptions[0]} onClick={() => currentUserActions(currentUserOptions[0])}/>
                        {!isMinWidth && ( 
                            <Info $background="#C12A23" $border="#C12A23" $color="#ffffff"> 
                                <h4> Quando solicitar? </h4>
                                <h5> Deve ser solicitado por professores ou funcionários para uso agendado e temporário em diferentes campi. A liberação é imediata se houver um selo disponível.</h5>
                            </Info>
                        )}

                    </ButtonWrapper>

                    <ButtonWrapper>
                        <GenericButton width="100%" height="60px" buttonType="Transparent"content={currentUserOptions[1]} key={currentUserOptions[1]} onClick={() => currentUserActions(currentUserOptions[1])}/>
                        {!isMinWidth && ( 
                            <Info $background="rgba(0,0,0,0)" $border="#C12A23" $color="#000000"> 
                                <h4> Quando solicitar? </h4>
                                <h5>Solicitada por um membro do INF para autorizar o acesso de um visitante externo. A solicitação deve ser feita com antecedência e requer aprovação.</h5>
                            </Info>
                        )}

                    </ButtonWrapper>

                    <ButtonWrapper>
                        <GenericButton width="100%" height="60px" buttonType="Black" content={currentUserOptions[2]} key={currentUserOptions[2]} onClick={() => currentUserActions(currentUserOptions[2])}/>
                        {!isMinWidth && ( 
                            <Info $background="#000000ff" $border="#000000" $color="#ffffff"> 
                                <h4> Quando solicitar? </h4>
                                <h5>Destinada a usuários não vinculados diretamente ao INF, mas que atuam no local por um longo período, como funcionários de outros centros. Possui validade semestral e necessita de aprovação.</h5>
                            </Info>
                        )}
                    </ButtonWrapper>
                </ButtonsContainer>

                {isMinWidth && ( 
                <InfoContainer>

                    <Info $background="#C12A23" $border="#C12A23" $color="#ffffff"> 
                        <h4> Quando solicitar? </h4>
                        <h5> Deve ser solicitado por professores ou funcionários para uso agendado e temporário em diferentes campi. A liberação é imediata se houver um selo disponível.</h5>
                    </Info>

                    <Info $background="rgba(0,0,0,0)" $border="#C12A23" $color="#000000"> 
                        <h4> Quando solicitar? </h4>
                        <h5>Solicitada por um membro do INF para, por exemplo, autorizar o acesso de um visitante externo. A solicitação deve ser feita com antecedência e requer aprovação.</h5>
                    </Info>

                    <Info $background="#000000ff" $border="#000000" $color="#ffffff"> 
                        <h4> Quando solicitar? </h4>
                        <h5>Destinada a usuários não vinculados diretamente ao INF, mas que atuam no local por um longo período, como funcionários de outros centros. Possui validade semestral e necessita de aprovação.</h5>
                    </Info>

                </InfoContainer>
                )}

            </MainContainer>

        </TagRequestContainer>
    );
};

export default TagRequest;