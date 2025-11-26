import styled from "styled-components";

export const CardContainer = styled.div<{ $estado: "default" | "hover" | "selected"; $modo: "edit" | "approve" | "none"}>`
  width: 280px;
  background-color: white;
  border-radius: 15px;
  box-sizing: border-box;
  padding: 20px;
  position: relative;
  cursor: ${({ $modo }) => ($modo === "edit" ? "pointer" : "default")};
  
  align-self: start;
  
 
  transition: box-shadow 0.3s ease, border-color 0.3s ease;


  border: 1px solid ${({ $estado }) =>
    $estado === "hover" || $estado === "selected"
      ? "transparent"
      : "rgba(0, 0, 0, 0.1)"};


  box-shadow: ${({ $estado }) =>
    $estado === "hover"
      ? "0 4px 10px rgba(0, 0, 0, 0.15)" // Sombra mais forte
      : $estado === "selected"
      ? "0 0 0 2px rgba(0, 0, 0, 0.2)"   // Simula uma borda/outline
      : "0 2px 5px rgba(0, 0, 0, 0.05)"}; // Sombra sutil no estado default
`;

export const TagName = styled.div`
  display: flex;
  flex-direction: row;

  align-items: center;
  justify-content: space-between;

  width: 100%;
  
  margin: 0;
  font-weight: 700;
  text-align: center;
  font-size: 1em;  
`;

export const TagType = styled.p`
  margin: 0;
  text-align: center;
  font-size: 1em;
`;

export const InfoSection = styled.div`
    box-sizing: border-box;

    width: 100%;
    background: #C12A23;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    
    justify-content: flex-start;
    align-items: flex-start;

    padding: 20px 24px 20px 24px;
    box-sizing: border-box;

    font-size: clamp(14px, 1vw, 18px);
    color: #FFFFFF;

    @media (max-width: 1526px) {
        font-size: 14px;
    }
`;

export const DataItem = styled.div`
  box-sizing: border-box;

  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  margin-bottom: 12px;

  img {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: #FFFFFF;
    word-break: break-word;
  }
`;

export const TagApproveButtonWrapper = styled.div`
  box-sizing: border-box;

  display: flex;
  gap: 10px;
  width: 100%;
  padding-top: 15px
`;

export const Cabecalho = styled.div`
  box-sizing: border-box;
  position: relative;
  display: flex;
  width: 100%;
  justify-content: left;
  align-items: left;
  padding: 10px;
`;

export const TagTextGroup = styled.div`
  box-sizing: border-box;
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  color: rgba(0, 0, 0, 1);
  font-size: 1em;
`;

export const EditButtonWrapper = styled.div`
  box-sizing: border-box;
  position: absolute;
  top: 0;
  right: 0;
`;

export const StatusIconWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`
