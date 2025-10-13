import { Tag } from "lucide-react";
import React from "react";
import { useEffect, useState, useRef } from "react";

import {MainContainer, Separator, SubTitle, ServiceContainer, CardsContainer, RequestCardsContainer, GridCardsContainer} from "./styles";

import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import RequestFilter from "../../components/RequestFilter";
import RequestCard from "../../components/RequestCard";
import PaginationButtons from "../../components/PaginationButtons";

import { getAllSolicitations } from "../../api/functions";
import { sleep } from "../../utils/functions";

import { useNavigate } from "react-router-dom";
import { ErrorMessage } from "../../components/DateRangeSelector/styles";

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

    const [requests, setRequests] = useState<Request[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [selectedTag, setSelectedTag] = useState<string>("");
    const [plate, setPlate] = useState<string>("");
    const [name, setName] = useState<string>("");

    const navigate = useNavigate();

    useEffect(() => {

        const fetchRequests = async () => {
        try {

            setIsLoading(true); // Inicia o feedback de carregamento
            await sleep(1000);
            // Inicia a requisição
            const data = await getAllSolicitations();
            // 3. Atribui a lista recebida ao estado
            setRequests(data);
        } catch (err) {
            // Se ocorrer um erro, guarda a mensagem de erro no estado
            setError(true);
            setErrorMessage('Não foi possível carregar as solicitações.');
            console.error(err);
        } finally {
            // Este bloco sempre executa, com ou sem erro
            setIsLoading(false); // Termina o estado de carregamento
        }
        };

        fetchRequests(); // Executa a função de busca
    }, []); // O array vazio [] garante que isso rode apenas uma vez, quando o componente é montado


    const getRequestsPerPage = () => {
        if (window.innerWidth >= 1612) return 8;
        else if (window.innerWidth >= 800) return 6;
        else return 5;
    };

    const [requestsPerPage, setRequestsPerPage] = useState<number>(getRequestsPerPage());
    const [currentPage, setCurrentPage] = useState(1);

    // Define as ONGs que serão mostradas com base na página atual
    const startIndexShowedRequests = requestsPerPage * (currentPage - 1);
    const showedRequests = requests.slice(startIndexShowedRequests, startIndexShowedRequests + requestsPerPage);

    console.log("Total de solicitações recebidas:", requests.length);
    console.log("Limite de itens por página:", requestsPerPage);
    console.log("Itens que deveriam ser mostrados (showedRequests):", showedRequests.length);

    useEffect(() => {
        // Função que será chamada sempre que a janela for redimensionada
        const handleResize = () => {
            setRequestsPerPage(getRequestsPerPage());
        };

        // Adiciona o "ouvinte" ao evento 'resize' da janela
        window.addEventListener('resize', handleResize);

        // Função de limpeza: remove o "ouvinte" quando o componente é desmontado.
        // Isso é crucial para evitar vazamentos de memória.
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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
                        requests={requests.map(request => request.solicitation_id)}
                        selectedTag={selectedTag}
                        setSelectedTag={setSelectedTag}
                        plate={plate}
                        setPlate={setPlate}
                        name={name}
                        setName={setName}
                    />

                    <GridCardsContainer>

                        {isLoading && (
                            <h3> Carrgando Solicitações... </h3>
                        )}

                        {!isLoading && error && (
                            <h3>{errorMessage}</h3>
                        )}

                        {requests.length == 0 && !isLoading && !error &&(
                            <h3> Não há solicitações pendentes </h3>
                        )}
                        
                        <RequestCardsContainer>

                            {showedRequests.length > 0 && showedRequests.map((request) => (
                                <RequestCard
                                    key={request.solicitation_id}
                                    request={request}
                                    showApproveButtons={true}
                                    onApproveClick={() => navigate("/")} //irei substituir pelo modal de aprovação
                                    onRejectClick={() => navigate("/")}
                                />
                            ))}

                        </RequestCardsContainer>

                        <PaginationButtons
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            itemsLength={requests.length}
                            itemsPerPage={requestsPerPage}
                            buttonHeight="30px"
                            buttonWidth="30px"
                            containerHeight="160px"
                        />

                    </GridCardsContainer>

                </CardsContainer>

            </MainContainer>

        </ServiceContainer>
    );
};

export default ApproveRequest;