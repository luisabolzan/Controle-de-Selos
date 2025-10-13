import { Tag } from "lucide-react";
import React from "react";
import { useEffect, useState, useRef } from "react";

import {MainContainer, Separator, SubTitle, ServiceContainer, CardsContainer, RequestCardsContainer} from "./styles";

import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import RequestFilter from "../../components/RequestFilter";
import RequestCard from "../../components/RequestCard";

import { useNavigate } from "react-router-dom";

interface Request {
    solicitation_id: string;
    creation_date: string;
    is_approved: boolean;
    reviewed: boolean
    start_date: string;
    end_date: string;
    solicited_tag_type: string; 
    vehicle_id: string;
    user_id: string;
}

const ApproveRequest = () => {

    const [requests, setRequests] = useState<string[]>([]);
    const [selectedTag, setSelectedTag] = useState<string>("");
    const [plate, setPlate] = useState<string>("");
    const [name, setName] = useState<string>("");

    const navigate = useNavigate();

    // ===================== API ==================================================================================
    //constante usado para testar precisa usar um fetch da API para busaca todas as solicitações do banco
    const mockRequest: Request = {
        solicitation_id: '1',
        creation_date: '12/10/2025',
        is_approved: false,
        reviewed: false,
        start_date: '12/10/2025',
        end_date: '12/10/2025',
        solicited_tag_type: 'Selo de Serviço',
        vehicle_id: 'ABC1D23',
        user_id: '1'
    };

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

                    <RequestCardsContainer>
                        <RequestCard
                            key={1} // substituir por request.id
                            request={mockRequest}
                            showApproveButtons={true}
                            onApproveClick={() => navigate("/")} //irei substituir pelo modal de aprovação
                            onRejectClick={() => navigate("/")}
                        />

                        <RequestCard
                            key={1} // substituir por request.id
                            request={mockRequest}
                            showApproveButtons={true}
                            onApproveClick={() => navigate("/")}
                            onRejectClick={() => navigate("/")}
                        />


                        <RequestCard
                            key={1} // substituir por request.id
                            request={mockRequest}
                            showApproveButtons={true}
                            onApproveClick={() => navigate("/")}
                            onRejectClick={() => navigate("/")}
                        />


                        <RequestCard
                            key={1} // substituir por request.id
                            request={mockRequest}
                            showApproveButtons={true}
                            onApproveClick={() => navigate("/")}
                            onRejectClick={() => navigate("/")}
                        />

                                                <RequestCard
                            key={1} // substituir por request.id
                            request={mockRequest}
                            showApproveButtons={true}
                            onApproveClick={() => navigate("/")} //irei substituir pelo modal de aprovação
                            onRejectClick={() => navigate("/")}
                        />

                        <RequestCard
                            key={1} // substituir por request.id
                            request={mockRequest}
                            showApproveButtons={true}
                            onApproveClick={() => navigate("/")}
                            onRejectClick={() => navigate("/")}
                        />


                        <RequestCard
                            key={1} // substituir por request.id
                            request={mockRequest}
                            showApproveButtons={true}
                            onApproveClick={() => navigate("/")}
                            onRejectClick={() => navigate("/")}
                        />


                        <RequestCard
                            key={1} // substituir por request.id
                            request={mockRequest}
                            showApproveButtons={true}
                            onApproveClick={() => navigate("/")}
                            onRejectClick={() => navigate("/")}
                        />
                    </RequestCardsContainer>

                </CardsContainer>

            </MainContainer>

        </ServiceContainer>
    );
};

export default ApproveRequest;