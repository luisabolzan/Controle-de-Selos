import React, { useEffect, useState, useRef, useCallback } from "react";

import {
  MainContainer,
  Separator,
  ServiceContainer,
  CardsContainer,
  RequestCardsContainer,
  GridCardsContainer,
} from "./styles";

import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import RequestFilter from "../../components/RequestFilter";
import UserRequestCard from "../../components/UserRequestCard";
import PaginationButtons from "../../components/PaginationButtons";
import ConfirmModal from "../../components/ConfirmModal";
import Toast from "../../components/Toast";

import { sleep } from "../../utils/functions";

import { getAllSolicitations, updateSolicitationStatus } from "../../api/functions";
import { Request } from "../../components/UserRequestCard/types";
import { useNavigate } from "react-router-dom";

type ModalAction = {
  tipo: "excluir";
  solicitationId: string;
} | null;

const UserRequest = () => {
  // --- ESTADOS DE DADOS ---
  const [requests, setRequests] = useState<Request[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0); // Total geral no banco (para paginação)
  
  // --- ESTADOS DE CONTROLE ---
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isBarExpanded, setIsBarExpanded] = useState<boolean>(true);

  // --- ESTADOS DE FILTRO ---
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [plate, setPlate] = useState<string>("");
  const [name, setName] = useState<string>("");

  // --- TRIGGER DO FILTRO ---
  const [searchTrigger, setSearchTrigger] = useState(0);

  // --- ESTADOS DE PAGINAÇÃO ---
  const getRequestsPerPage = () => {
    if (window.innerWidth >= 1900) return 8;
    else if (window.innerWidth >= 1612) return 6;
    else return 4;
  };

  const getRequestsPerPage2 = () => {
    if (window.innerWidth >= 1900) return 6;
    else if (window.innerWidth >= 1612) return 4;
    else return 2;
  };

  // versão quando a sidebar está expandida

  const [requestsPerPage, setRequestsPerPage] = useState<number>(getRequestsPerPage());
  const [currentPage, setCurrentPage] = useState(1);

  const tagValues: Record<string, string> = {
    "Selo de Serviço": "service",
    "Liberação Eventual": "eventual",
    "Credencial Provisória": "temp"
  }

  // Usamos useCallback para evitar recriação da função em todo render
  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      await sleep(500);
      setError(false);

      const filters = {
        page: currentPage,
        size: requestsPerPage,
        name: name,
        plate: plate,
        tag_type: tagValues[selectedTag],
        status: 'pendente' as const
      };

      const response = await getAllSolicitations(filters);

      setRequests(response.data);
      setTotalItems(response.total); // Importante para o componente de paginação saber o fim

    } catch (err) {
      setError(true);
      setErrorMessage("Não foi possível carregar as solicitações.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, requestsPerPage, selectedTag, searchTrigger]);


  // 1. Busca dados sempre que paginação ou filtros mudam
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

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

  // mudar a quantidade de itens por pagina quando a side bar ocupar mais espaço no container
  useEffect(() => {
    const handleSidebarChange = (e: Event) => {
      const ev = e as CustomEvent<{ expanded?: boolean }>;
      const expanded = ev.detail?.expanded;
      if (expanded === true) {
        setRequestsPerPage(getRequestsPerPage2());
        setIsBarExpanded(true)
      } else {
        setRequestsPerPage(getRequestsPerPage());
        setIsBarExpanded(false)
      }
    };

    window.addEventListener('sidebarToggle', handleSidebarChange as EventListener);

    return () => {
      window.removeEventListener('sidebarToggle', handleSidebarChange as EventListener);
    };
  }, []);

  // Estados para modais e toasts
  const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fullCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [modalAction, setModalAction] = useState<ModalAction>(null);

  const [toastType, setToastType] = useState<"excluir" | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  // Toast de erro
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorToastVisible, setErrorToastVisible] = useState(false);

  const approveSolicitation = async (solicitationId: string) => {
    const id = parseInt(solicitationId);
    await updateSolicitationStatus(id, true);
  };

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
  const showSuccessToast = (tipo: "excluir") => {
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

  const openModal = (tipo: "excluir" , solicitationId: string) => {
    resetToast();
    setModalAction({ tipo, solicitationId });
  };

  const handleConfirm = async () => {
    if (!modalAction) return;

    try {
      if (modalAction.tipo === "excluir") {
        await approveSolicitation(modalAction.solicitationId);
      }
      await fetchRequests();

      showSuccessToast(modalAction.tipo);
    } catch (error) {
      // Se der erro, mostra toast de erro
      console.error("Erro na operação:", error);

      const errorMessage = "Erro ao excluir Solicitação. Tente novamente.";

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

    setSearchTrigger((prev) => prev + 1);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedTag("");
    setPlate("");
    setName("");

    setSearchTrigger((prev) => prev + 1);
    setCurrentPage(1);

  };

  const navigate = useNavigate();

  return (
    <ServiceContainer>
      <SideBar />

      <MainContainer>
        <Header />

        <Separator>
          <h1> Minhas Solicitações </h1>
        </Separator>

        <CardsContainer>
          <RequestFilter
            requests={[]} 
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            plate={plate}
            setPlate={setPlate}
            name={name}
            nameField={false}
            setName={setName}
            onSearch={handleSearch}
            onClearFilters={handleClearFilters}
          />

          <GridCardsContainer>
            {isLoading && <h3> Carregando Solicitações... </h3>}

            {!isLoading && error && <h3>{errorMessage}</h3>}

            {requests.length === 0 && !isLoading && !error && (
              <h3> Não há solicitações pendentes </h3>
            )}
            
            <RequestCardsContainer isBarExpanded={isBarExpanded}>
              {requests.length > 0 &&
                requests.map((request) => (
                  <UserRequestCard
                    key={request.solicitation_id}
                    request={request}
                    showApproveButtons={true}
                    onDeleteClick={() =>
                      openModal("excluir", request.solicitation_id)
                    }
                    onEditClick={() =>
                      navigate('/')
                    }
                  />
                ))}

              <ConfirmModal
                isOpen={modalAction !== null}
                title= "Tem certeza que deseja exlcuir esta solicitação?"
                message= "Tem certeza de que deseja excluir esta solicitação? Após exlcuir essa solicitação o admnsitrador não poderá mais visualizá-la e aprová-la."
                confirmLabel="Sim, Excluir"
                cancelLabel="Cancelar"
                onConfirm={handleConfirm}
                onClose={() => setModalAction(null)}
              />

              {showToast && toastType && (
                <Toast
                  type="success"
                  message= "Solicitação excluída com sucesso"
                  description="Sua solicitação foi excluida e não será mais avaliada"
                  onClose={() => {
                    setToastVisible(false);
                    setTimeout(() => setShowToast(false), 300);
                  }}
                  isVisible={toastVisible}
                />
              )}

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
              itemsLength={totalItems}
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

export default UserRequest;