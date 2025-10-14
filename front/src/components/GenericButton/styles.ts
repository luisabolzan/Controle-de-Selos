import styled from "styled-components";

const BaseButton = styled.button<{$width?: string; $height?: string;  $flex?: boolean; $paddingV?: string; $paddingH?: string; $flexStatus?:string; $fontSize?: string; $fontWeight?:string}>`
  font-family: "Nunito Sans", sans-serif;
  font-weight: 500;
  font-size: clamp(35px, 1vw, 15px);
  border-radius: 100px;
  padding-top: ${(props) => props.$paddingV || 'auto'};
  padding-bottom: ${(props) => props.$paddingV || 'auto'};
  padding-left: ${(props) => props.$paddingH || 'auto'};
  padding-right: ${(props) => props.$paddingH || 'auto'};
  box-sizing: border-box;

  display: flex;
  flex: ${(props)=>props.$flexStatus};
  justify-content: center;
  align-items: center;
  white-space:nowrap;

  width: ${(props) =>
  props.$flex ? "100%" : props.$width || "auto"}; 
  ${(props) => props.$flex && "flex: 1;"};

  height: ${(props) => props.$height || 'auto'};
  min-height: 34px;

  transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s ease;

  font-size:  ${(props)=>props.$fontSize};
  font-weight:  ${(props)=>props.$fontWeight};;

  &:disabled {
    background-color: #D7D6D6;
    border: none;
    color: #919191ff;
    cursor: default;
    transform: scale(1.0); 
  }

  &:disabled:hover,
  &:disabled:active {
    background-color: #D7D6D6;
    color: #919191ff;
    border: none;
    transform: scale(1.0);
    cursor: default;
  }

  &:hover,
  &:active {
    cursor: pointer;
    transform: scale(1.05);
  }

  @media (max-width: 1480px) {
    ${(props) => props.$flex ? 'flex:1;' : 'flex:none;'};
  }

`;

export const RedButton = styled(BaseButton)<{$highlighted: boolean, $flex?: boolean}>`
  background-color: #C12a23;
  border: 1px solid #C12a23;
  color: #ffffff;

`;

export const TransparentButton = styled(BaseButton)<{$highlighted: boolean, $flex?: boolean}>`
  background-color: rgba(0,0,0,0);
  border: 1px solid #C12a23;
  color: #000000;

`;

export const BlackButton = styled(BaseButton)<{$highlighted: boolean, $flex?: boolean}>`
  background-color: #000000;
  border: 1px solid #000000;
  color: #ffffff;

`;
