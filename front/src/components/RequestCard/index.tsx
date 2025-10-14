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
} from "./styles";
import { RequestCardProps } from "./types";

import Location from "../../assets/calendar-arrow-up.svg";
import Id from "../../assets/calendar-check-2.svg";
import Phone from "../../assets/car.svg";
import Email from "../../assets/id-card.svg";

import GenericButton from "../GenericButton";
import EditButton from "../EditButton";
import ActionText from "../ActionText";

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
  const requestInfo = [
    request?.start_date || "",
    request?.end_date || "",
    request?.vehicle?.model || "",
    request?.vehicle?.plate || "",
  ];

  const requestIcons = [
    Location,
    Id,
    Phone,
    Email
  ];

  return (
    <CardContainer
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      $estado={selected ? "selected" : hovered ? "hover" : "default"}
      $modo={showApproveButtons ? "approve" : showEditOptions ? "edit" : "none"}
    >
      <Cabecalho>
        <RequestTextGroup>
          <RequestName>{request?.user?.name || "Nome não informado"}</RequestName>
          <RequestType>{request?.solicited_tag_type || "Tipo de selo não informado"}</RequestType>
        </RequestTextGroup>

      </Cabecalho>

      <InfoSection>
        {requestInfo.map((info, i) => (
          info != "" && (<DataItem key={i}>
            <img src={requestIcons[i]} alt="" />
            <p>{info}</p>
          </DataItem>)
        ))}
        
        <ActionText 
          width="auto" 
          fontSize="1.125em" 
          onClick={()=>navigate("/")} 
          textColor="#000000" 
          underlineOnHover
        >
          <h2>Saber Mais</h2>
        </ActionText>

      </InfoSection>

      {showApproveButtons && request &&(
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
          />
        </RequestApproveButtonWrapper>
      )}
    </CardContainer>
  );
};

export default RequestCard;
