import { Tag } from "lucide-react";
import React from "react";
import { useEffect, useState, useRef } from "react";

import {MainContainer, Separator, SubTitle, ServiceContainer, CardsContainer} from "./styles";

import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import RequestFilter from "../../components/RequestFilter";

const ApproveRequest = () => {

    const [requests, setRequests] = useState<string[]>([]);
    const [selectedTag, setSelectedTag] = useState<string>("");
    const [plate, setPlate] = useState<string>("");
    const [name, setName] = useState<string>("");

    return(
        <ServiceContainer>
            <SideBar/>

            <MainContainer>
                <Header/>

                <Separator>
                    <h1> Solicitações Pendentes </h1>
                </Separator>

                <CardsContainer>

                    <RequestFilter
                        ngos={requests}
                        selectedTag={selectedTag}
                        setSelectedTag={setSelectedTag}
                        plate={plate}
                        setPlate={setPlate}
                        name={name}
                        setName={setName}
                    />

                </CardsContainer>

            </MainContainer>

        </ServiceContainer>
    );
};

export default ApproveRequest;