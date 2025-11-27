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
import PaginationButtons from "../../components/PaginationButtons";
import ConfirmModal from "../../components/ConfirmModal";
import Toast from "../../components/Toast";
import UserTagCard from "../../components/UserTagCard";
import AdminTagCard from "../../components/UserTagCard";

import { sleep } from "../../utils/functions";

import { getAllSolicitations, updateSolicitationStatus, getUserTags, getAllTags, returnTag } from "../../api/functions";
import { Tag } from "../../components/UserTagCard/types";
import { useNavigate } from "react-router-dom";

type ModalAction = {
  tipo: "excluir";
  solicitationId: number;
} | null;

const AllTags = () => {
  // --- ESTADOS DE DADOS ---
  const [tags, setTags] = useState<Tag[]>([]);
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
  const gettagsPerPage = () => {
    if (window.innerWidth >= 1900) return 8;
    else if (window.innerWidth >= 1612) return 6;
    else return 4;
  };

    const gettagsPerPage2 = () => {
    if (window.innerWidth >= 1900) return 6;
    else if (window.innerWidth >= 1612) return 4;
    else return 2;
  };

  // mudar a quantidade de itens por pagina quando a side bar ocupar mais espaço no container
  useEffect(() => {
    const handleSidebarChange = (e: Event) => {
      const ev = e as CustomEvent<{ expanded?: boolean }>;
      const expanded = ev.detail?.expanded;
      if (expanded === true) {
        setTagsPerPage(gettagsPerPage2());
        setIsBarExpanded(true)
      } else {
        setTagsPerPage(gettagsPerPage());
        setIsBarExpanded(false)
      }
    };

    window.addEventListener('sidebarToggle', handleSidebarChange as EventListener);

    return () => {
      window.removeEventListener('sidebarToggle', handleSidebarChange as EventListener);
    };
  }, []);

  const [tagsPerPage, setTagsPerPage] = useState<number>(gettagsPerPage());
  const [currentPage, setCurrentPage] = useState(1);

  const tagValues: Record<string, string> = {
    "Selo de Serviço": "service",
    "Liberação Eventual": "eventual",
    "Credencial Provisória": "temp"
  }

  // Usamos useCallback para evitar recriação da função em todo render
  const fetchtags = useCallback(async () => {
    try {
      setIsLoading(true);
      await sleep(500);
      setError(false);

      const filters = {
        page: currentPage,
        size: tagsPerPage,
        current_username: name,
        vehicle_plate: plate,
        tag_type: tagValues[selectedTag],
        status: 'pendente' as const
      };

      const response = await getAllTags(filters);
      console.log(response);

      setTags(response.data);
      setTotalItems(response.total); // Importante para o componente de paginação saber o fim

    } catch (err) {
      setError(true);
      setErrorMessage("Não foi possível carregar as solicitações.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, tagsPerPage, selectedTag, searchTrigger]);


  // 1. Busca dados sempre que paginação ou filtros mudam
  useEffect(() => {
    fetchtags();
  }, [fetchtags]);

  useEffect(() => {
    // Função que será chamada sempre que a janela for redimensionada
    const handleResize = () => {
      setTagsPerPage(gettagsPerPage());
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

  const openModal = (tipo: "excluir" , solicitationId: number) => {
    resetToast();
    setModalAction({ tipo, solicitationId });
  };

  const handleConfirm = async () => {
    if (!modalAction) return;

    try {
      if (modalAction.tipo === "excluir") {
        await returnTag(modalAction.solicitationId);
      }
      await fetchtags();

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

  const handleDevolution = async (tagid : number) => {

    await returnTag(tagid);

  }

  const navigate = useNavigate();

  return (
    <ServiceContainer>
      <SideBar />

      <MainContainer>
        <Header />

        <Separator>
          <h1> Selos Emprestados </h1>
        </Separator>

        <CardsContainer>
          <RequestFilter
            requests={[]} 
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

            {tags?.length === 0 && !isLoading && !error && (
              <h3> Não existe selos emprestados </h3>
            )}
            
            <RequestCardsContainer isBarExpanded={isBarExpanded}>
              {tags?.length > 0 &&
                tags.map((tag) => (
                  <UserTagCard
                    key={tag.tag_id}
                    tag={tag}
                    onDevolutionClick={()=>openModal("excluir", tag.tag_id)}  
                  />
                ))}

              <ConfirmModal
                isOpen={modalAction !== null}
                title= "Confirmar Devolução?"
                message= 'Confirmar Devolução torna este selo disponível ao uso de outros usuários. O selo foi devolvido e esta em suas mãos?' 
                confirmLabel="Sim, Confirmar"
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
              itemsPerPage={tagsPerPage}
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

export default AllTags;