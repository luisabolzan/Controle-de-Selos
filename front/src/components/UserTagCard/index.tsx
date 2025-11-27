import React, { useState , useMemo} from "react";
import {
  CardContainer,
  InfoSection,
  TagName,
  TagType,
  DataItem,
  EditButtonWrapper,
  TagApproveButtonWrapper,
  Cabecalho,
  TagTextGroup,
  StatusIconWrapper,
} from "./styles";
import { UserTagCardProps } from "./types";

import Calendar1 from "../../assets/calendar-arrow-up.svg";
import Calendar2 from "../../assets/calendar-check-2.svg";
import UserSvg from "../../assets/user.svg"
import Phone from "../../assets/car.svg";
import Email from "../../assets/id-card.svg";
import { ClockAlert, CircleX, CircleCheckBig, Tag, User } from "lucide-react";

import GenericButton from "../GenericButton";
import EditButton from "../EditButton";
import ActionText from "../ActionText";
import dateToDdMmYy from "../../views/ServiceTagRequest/index"

import { useNavigate } from "react-router-dom";

const UserTagCard: React.FC<UserTagCardProps> = ({
  tag,
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
  //   has_active_Tag: true
  // }

  // Criar array com informações da Tag baseado nos dados recebidos
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

  const TagInfo = [
    tag?.end_date ? dateToDdMmYyyy(tag?.end_date) : "",
    tag?.vehicle_plate || "",
    tag?.current_user_email || "",
  ];

  const TagIcons = [Calendar1, Phone, Email];

  // lê isAdmin do localStorage (aceita 'true' ou '1')
  const isAdmin = useMemo(() => {
    const v = localStorage.getItem('isAdmin');
    return v === 'true' || v === '1';
  }, []);

  return (
    <CardContainer
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      $estado={selected ? "selected" : hovered ? "hover" : "default"}
      $modo={showApproveButtons ? "approve" : showEditOptions ? "edit" : "none"}
    >
      <Cabecalho>
        <TagTextGroup>
          
          <StatusIconWrapper>

            <TagName>
              {tag?.tag_type == "temp"
              ? "Credencial Provisória"
              : tag?.tag_type == "eventual"
              ? "Liberação Eventual"
              : tag?.tag_type == "service"
              ? "Selo de Serviço"
              : "Selo não informado"}
            </TagName>
            
              {tag?.end_date && (new Date(tag.end_date) < new Date(new Date().setDate(new Date().getDate() + 5))) ? (
                <span title={`Expira em ${TagInfo[0]}`}>
                  <ClockAlert color="orange" size={24} />
                </span>
              ) : 

              (tag?.end_date && (new Date(tag.end_date) < new Date()) ? (
                <span title={`Expirado efetue a renovação ou devolução`}>
                  <ClockAlert color="orange" size={24} />
                </span>
              ) : null
              )
              }

          </StatusIconWrapper>
        
          <TagType>
            <p>{tag?.tag_id}</p>
          </TagType>
        </TagTextGroup>
      </Cabecalho>

      <InfoSection>
        {TagInfo.map((info, i) => (
          <DataItem key={i}>
            <img src={TagIcons[i]} alt="" />
            <p>{info ? info : "Indisponível"}</p>
          </DataItem>
        ))}

        {isAdmin ? (
          <DataItem>
            <img src={UserSvg} alt="" />
            <p>{tag?.current_username}</p>
          </DataItem>
        ):null}

      </InfoSection>

    </CardContainer>
  );
};

export default UserTagCard;
