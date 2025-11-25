import { Tag } from "lucide-react";
import React from "react";
import { useEffect, useState, useRef } from "react";

import {
  MainContainer,
  Separator,
  SubTitle,
  ServiceContainer,
  CardsContainer,
  RequestCardsContainer,
  GridCardsContainer,
} from "./styles";

import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import RequestFilter from "../../components/RequestFilter";
import RequestCard from "../../components/RequestCard";
import PaginationButtons from "../../components/PaginationButtons";
import ConfirmModal from "../../components/ConfirmModal";
import Toast from "../../components/Toast";

import { getAllSolicitations } from "../../api/functions";
import { sleep } from "../../utils/functions";

import { data, useNavigate } from "react-router-dom";
import { ErrorMessage } from "../../components/DateRangeSelector/styles";

import { updateSolicitationStatus } from "../../api/functions";
import { Request } from "../../components/RequestCard/types";

type ModalAction = {
  tipo: "aprovar" | "recusar";
  solicitationId: string;
} | null;

const ApproveRequest = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedTag, setSelectedTag] = useState<string>("");
  const [plate, setPlate] = useState<string>("");
  const [name, setName] = useState<string>("");

  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      setIsLoading(true); // Inicia o feedback de carregamento
      await sleep(1000);
      // Inicia a requisição
      const response = await getAllSolicitations();
      // 3. Atribui a lista recebida ao estado
      setRequests(response.data);
    } catch (err) {
      // Se ocorrer um erro, guarda a mensagem de erro no estado
      setError(true);
      setErrorMessage("Não foi possível carregar as solicitações.");
      console.error(err);
    } finally {
      // Este bloco sempre executa, com ou sem erro
      setIsLoading(false); // Termina o estado de carregamento
    }
  };

  useEffect(() => {
    fetchRequests(); // Executa a função de busca
  }, []); // O array vazio [] garante que isso rode apenas uma vez, quando o componente é montado

  const getRequestsPerPage = () => {
    if (window.innerWidth >= 1900) return 8;
    else if (window.innerWidth >= 1612) return 6;
    else return 4;
  };

  const [requestsPerPage, setRequestsPerPage] = useState<number>(
    getRequestsPerPage()
  );
  const [currentPage, setCurrentPage] = useState(1);

  // Define as solicitações que serão mostradas com base na página atual
  const startIndexShowedRequests = requestsPerPage * (currentPage - 1);
  const showedRequests = requests.slice(
    startIndexShowedRequests,
    startIndexShowedRequests + requestsPerPage
  );
  
  const filteredRequests = showedRequests.filter((request) => {
    
    const matchesTag = selectedTag
      ? request.solicited_tag_type === selectedTag
      : true;
    const matchesPlate = !plate
      ? true
      : request.vehicle && request.vehicle.plate
      ? request.vehicle.plate.toLowerCase().includes(plate.toLowerCase())
      : false;
    const matchesName = name
      ? request.user.name.toLowerCase().includes(name.toLowerCase())
      : true;
    return matchesTag && matchesPlate && matchesName;
  });

  //console.log("Total de solicitações recebidas:", requests.length);
  //console.log("Limite de itens por página:", requestsPerPage);
  //console.log("Itens que deveriam ser mostrados (showedRequests):", showedRequests.length);

  useEffect(() => {
    // Função que será chamada sempre que a janela for redimensionada
    const handleResize = () => {
      setRequestsPerPage(getRequestsPerPage());
    };

    // Adiciona o "ouvinte" ao evento 'resize' da janela
    window.addEventListener("resize", handleResize);

    // Função de limpeza: remove o "ouvinte" quando o componente é desmontado.
    // Isso é crucial para evitar vazamentos de memória.
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Estados para modais e toasts
  const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fullCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [modalAction, setModalAction] = useState<ModalAction>(null);

  // Toast de sucesso
  const [toastType, setToastType] = useState<"aprovar" | "recusar" | null>(
    null
  );
  const [showToast, setShowToast] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  // Toast de erro
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorToastVisible, setErrorToastVisible] = useState(false);

  //=======================================================================================================
  //================ USAR API FUNCTION ====================================================================
  //=======================================================================================================
  const approveSolicitation = async (solicitationId: string) => {
    const id = parseInt(solicitationId);
    await updateSolicitationStatus(id, true);
  };

  //=======================================================================================================
  //================ USAR API FUNCTION ====================================================================
  //=======================================================================================================
  const rejectSolicitation = async (solicitationId: string) => {
    const id = parseInt(solicitationId);
    await updateSolicitationStatus(id, false);
  };

  /* Função para resetar toast de sucesso
   */
  const resetToast = () => {
    setToastVisible(false);

    if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    if (fullCloseTimeoutRef.current) clearTimeout(fullCloseTimeoutRef.current);

    setShowToast(false);
    setToastType(null);
  };

  /**
   * Função para mostrar toast de erro
   */
  const showErrorToastMessage = (message: string) => {
    setErrorToast(message);
    setShowErrorToast(true);
    setErrorToastVisible(true);

    // Auto-hide após 4 segundos
    setTimeout(() => {
      setErrorToastVisible(false);
      setTimeout(() => {
        setShowErrorToast(false);
        setErrorToast(null);
      }, 300);
    }, 4000);
  };

  /**
   * Função para mostrar toast de sucesso
   */
  const showSuccessToast = (tipo: "aprovar" | "recusar") => {
    resetToast();
    setToastType(tipo);
    setShowToast(true);

    showTimeoutRef.current = setTimeout(() => setToastVisible(true), 50);
    hideTimeoutRef.current = setTimeout(() => setToastVisible(false), 3000);
    fullCloseTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
      setToastType(null);
    }, 3500);
  };

  /**
   * Abrir modal (e fechar toast se estiver aberto)
   */
  const openModal = (tipo: "aprovar" | "recusar", solicitationId: string) => {
    resetToast();
    setModalAction({ tipo, solicitationId: solicitationId });
  };

  /**
   * Confirmar ação - VERSÃO CORRIGIDA
   */
  const handleConfirm = async () => {
    if (!modalAction) return;

    try {
      if (modalAction.tipo === "aprovar") {
        await approveSolicitation(modalAction.solicitationId);
      } else if (modalAction.tipo === "recusar") {
        await rejectSolicitation(modalAction.solicitationId);
      }

      await fetchRequests();

      showSuccessToast(modalAction.tipo);
    } catch (error) {
      // Se der erro, mostra toast de erro
      console.error("Erro na operação:", error);

      const errorMessage =
        modalAction.tipo === "aprovar"
          ? "Erro ao aprovar Solicitação. Tente novamente."
          : "Erro ao rejeitar Solicitação. Tente novamente.";

      showErrorToastMessage(errorMessage);
    } finally {
      setModalAction(null);
    }
  };

  const handleSearch = (filters: {
    name: string;
    plate: string;
    state: string;
  }) => {
    setSelectedTag(filters.state);
    setPlate(filters.plate);
    setName(filters.name);
  };

  const handleClearFilters = () => {
    setSelectedTag("");
    setPlate("");
    setName("");
  };
  return (
    <ServiceContainer>
      <SideBar />

      <MainContainer>
        <Header />

        <Separator>
          <h1> Solicitações Pendentes </h1>
        </Separator>

        <CardsContainer>
          <RequestFilter
            requests={requests.map((request) => request.solicitation_id)}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            plate={plate}
            setPlate={setPlate}
            name={name}
            setName={setName}
            onSearch={handleSearch}
            onClearFilters={handleClearFilters}
          />

          <GridCardsContainer>
            {isLoading && <h3> Carregando Solicitações... </h3>}

            {!isLoading && error && <h3>{errorMessage}</h3>}

            {requests.length == 0 && !isLoading && !error && (
              <h3> Não há solicitações pendentes </h3>
            )}
            <RequestCardsContainer>
              {filteredRequests.length > 0 &&
                filteredRequests.map((request) => (
                  <RequestCard
                    key={request.solicitation_id}
                    request={request}
                    showApproveButtons={true}
                    onApproveClick={() =>
                      openModal("aprovar", request.solicitation_id)
                    }
                    onRejectClick={() =>
                      openModal("recusar", request.solicitation_id)
                    }
                  />
                ))}

              {/* Modal de Confirmação */}
              <ConfirmModal
                isOpen={modalAction !== null}
                title={
                  modalAction?.tipo === "aprovar"
                    ? "Tem certeza que deseja aprovar esta solicitação?"
                    : "Tem certeza que deseja recusar esta solicitação?"
                }
                message={
                  modalAction?.tipo === "aprovar"
                    ? "Tem certeza de que deseja aprovar este selo? Caso este selo não possa ser entregue ao usário você pode redefinir o status da solicitação em solicitações concluidas"
                    : "Uma vez recusada, a solicitação sairá da lista de avaliação."
                }
                confirmLabel={
                  modalAction?.tipo === "aprovar"
                    ? "Sim, Aprovar"
                    : "Sim, Recusar"
                }
                cancelLabel="Cancelar"
                onConfirm={handleConfirm}
                onClose={() => setModalAction(null)}
              />

              {/* Toast de Sucesso */}
              {showToast && toastType && (
                <Toast
                  type="success"
                  message={`Solicitação ${
                    toastType === "aprovar" ? "aprovada" : "recusada"
                  } com sucesso!`}
                  description={`${
                    toastType === "aprovar"
                      ? "Confirme o recebimento na retirada"
                      : "Status de solicitação atualizado"
                  }`}
                  onClose={() => {
                    setToastVisible(false);
                    setTimeout(() => setShowToast(false), 300);
                  }}
                  isVisible={toastVisible}
                />
              )}

              {/* Toast de Erro */}
              {showErrorToast && errorToast && (
                <Toast
                  type="error"
                  message="Erro na operação"
                  description={errorToast}
                  onClose={() => {
                    setErrorToastVisible(false);
                    setTimeout(() => {
                      setShowErrorToast(false);
                      setErrorToast(null);
                    }, 300);
                  }}
                  isVisible={errorToastVisible}
                />
              )}
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
