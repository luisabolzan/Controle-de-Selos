import React, { useState } from "react";
import {
  CardContainer,
  InfoSection,
  RequestName,
  RequestType,
  DataItem,
  EditButtonWrapper,
  RequestApproveButtonWrapper,
  Cabecalho,
  RequestTextGroup,
  StatusIconWrapper,
} from "./styles";
import { RequestCardProps } from "./types";

import Location from "../../assets/calendar-arrow-up.svg";
import Id from "../../assets/calendar-check-2.svg";
import Phone from "../../assets/car.svg";
import Email from "../../assets/id-card.svg";
import { ClockAlert, CircleX, CircleCheckBig } from "lucide-react";

import GenericButton from "../GenericButton";
import EditButton from "../EditButton";
import ActionText from "../ActionText";
import dateToDdMmYy from "../../views/ServiceTagRequest/index"

import { useNavigate } from "react-router-dom";

const RequestCard: React.FC<RequestCardProps> = ({
  request,
  showApproveButtons = false,
  showEditOptions = false,
  onApproveClick,
  onRejectClick,
  onEditClick,
  onDeleteClick,
  selected = false,
}) => {
  const navigate = useNavigate();

  const [hovered, setHovered] = useState(false);

  // // ===================== API ==================================================================================
  // //constante usado para testar precisa usar um fetch da API para busaca o veiculo relacionado a esta solicitação
  // const mockVehicle: Vehicle = {
  //       vehicle_id: '1',
  //       plate: 'ABC1D23',
  //       model: 'HB20',
  //       color: 'Branco'
  // };

  // // ===================== API ==================================================================================
  // //constante usado para testar precisa usar um fetch da API para buscar o user relacionado a esta solicitação
  // const mockUser: User = {
  //   user_id: '1',
  //   password_hash: 'jskajskajskakak',
  //   cpf: '00011122234',
  //   email: 'teste@gmail.com',
  //   name: 'Lucineia',
  //   phone_number: '77777-7777',
  //   is_admin: true,
  //   UFRGS_number: '00123456',
  //   has_active_request: true
  // }

  // Criar array com informações da Request baseado nos dados recebidos
function dateToDdMmYyyy(dataIso: string): string {
  // 1. Cria um objeto Date a partir da string. O JavaScript/TypeScript
  //    interpreta nativamente o formato ISO "AAAA-MM-DDTHH:mm:ss".
  const data = new Date(dataIso);

  // 2. Extrai o dia, mês e ano do objeto Date.
  //    - .getDate() retorna o dia do mês (1-31)
  //    - .getMonth() retorna o mês (0-11), por isso somamos 1.
  //    - .getFullYear() retorna o ano com 4 dígitos.
  const dia = data.getDate();
  const mes = data.getMonth() + 1;
  const ano = data.getFullYear();

  // 3. Formata o dia e o mês para garantir que tenham dois dígitos (ex: "09" em vez de "9").
  //    O método .padStart() adiciona um "0" no início se a string tiver menos de 2 caracteres.
  const diaFormatado = String(dia).padStart(2, '0');
  const mesFormatado = String(mes).padStart(2, '0');

  // 4. Retorna a string final no formato desejado.
  return `${diaFormatado}/${mesFormatado}/${ano}`;
}

  const requestInfo = [
    request?.start_date ? dateToDdMmYyyy(request?.start_date) : "",
    request?.start_date ? dateToDdMmYyyy(request?.end_date) : "",
    request?.vehicle?.model || "",
    request?.vehicle?.plate || "",
  ];

  const requestIcons = [Location, Id, Phone, Email];

  return (
    <CardContainer
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      $estado={selected ? "selected" : hovered ? "hover" : "default"}
      $modo={showApproveButtons ? "approve" : showEditOptions ? "edit" : "none"}
    >
      <Cabecalho>
        <RequestTextGroup>
          
          <StatusIconWrapper>

            <RequestName>
              {request?.user?.name || "Nome não informado"}
            </RequestName>
            
              {request?.reviewed ? (
                request?.is_approved ? (
                  <CircleCheckBig color="green" size={24} />
                ) : (
                  <CircleX color="red" size={24} />
                )
              ) : (
                <ClockAlert color="orange" size={24} />
              )}

          </StatusIconWrapper>
        
          <RequestType>
            {request?.solicited_tag_type == "temp"
              ? "Credencial Provisória"
              : request?.solicited_tag_type == "eventual"
              ? "Liberação Eventual"
              : request?.solicited_tag_type == "service"
              ? "Selo de Serviço"
              : "Selo não informado"}
          </RequestType>
        </RequestTextGroup>
      </Cabecalho>

      <InfoSection>
        {requestInfo.map((info, i) => (
          <DataItem key={i}>
            <img src={requestIcons[i]} alt="" />
            <p>{info ? info : "Indisponível"}</p>
          </DataItem>
        ))}

        <ActionText
          width="auto"
          fontSize="1.125em"
          onClick={() => navigate("/")}
          textColor="#000000"
          underlineOnHover
        >
          <h2>Saber Mais</h2>
        </ActionText>
      </InfoSection>

      {showApproveButtons && request && (
        <RequestApproveButtonWrapper>
          <GenericButton
            buttonType="Transparent"
            content="Recusar"
            onClick={() => onRejectClick?.(request)}
            height="30px"
            fontSize="1em"
            fontWeight="800"
            flexStatus="1"
            $flex={true}
            isDisabled={request.reviewed}
          />
          <GenericButton
            buttonType="Red"
            content="Aprovar"
            onClick={() => onApproveClick?.(request)}
            height="30px"
            fontSize="1em"
            fontWeight="800"
            flexStatus="1"
            $flex={true}
            isDisabled={request.reviewed}
          />
        </RequestApproveButtonWrapper>
      )}
    </CardContainer>
  );
};

export default RequestCard;
