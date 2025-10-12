import { execFileSync } from 'child_process';
import styled from 'styled-components';


export const Container = styled.div `
    display: flex;
    flex-direction: column;

    width: 100%;
    min-width: 360px;
    min-height: 100vh;  
`

export const TagRequestContainer = styled.div`
    display: flex;
    flex-direction: row;

    width: 100%;
    min-height: 100vh;

    box-sizing: border-box;

    font-family: 'Ubuntu', sans-serif;

    :root {
    font-size: 16px;
    }

    h1 {
    font-size: clamp(40px, 35px + 2vw, 50px);
    font-weight: 300;
    width: 100%;
    }

    h2 {
    font-size: clamp(12px, 10px + 0.8vw, 15px);
    font-weight: 400;
    }

    h3 {
    font-size: clamp(20px, 15px + 1.2vw, 30px);
    font-weight: 300;
    }

    h4 {
    font-size: clamp(20px, 15px + 1.2vw, 30px);
    font-weight: 400;
    margin:0;
    }

    h5 {
    font-size: clamp(15px, 10px + 1.2vw, 25px);
    font-weight: 400;
    margin:0;
    }
`

export const MainContainer = styled.div`
    display: flex;
    flex-direction: column;

    width: 100%;
    height: 100%;

    align-items: center;

    box-sizing: border-box;
`

export const Separator = styled.div`

    width: 90%;
    border-bottom: 1px solid #D7D6D6;
    height: 100%;
`

export const SubTitle = styled.div`

    width: 90%;
    justify-content: left;

`

export const ButtonsContainer = styled.div `

    display: flex;
    flex-direction:  row;

    width: 90%;
    justify-content: center;

    box-sizing: border-box;

    gap: 2.08vw;

    padding-top: 75px;

    @media (max-width: 1480px) {
      flex-direction: column;
      justify-content:center;
      align-items: center;

      gap: 50px;
    }
`

export const ButtonWrapper = styled.div `
    display:flex;
    flex:1;

    gap: 20px;

    @media (max-width: 1480px) {
      flex-direction: column;
      flex:none;
      width: 100%;
    }
`

export const InfoContainer = styled.div `

    display: flex;
    flex-direction:  row;

    width: 90%;
    justify-content: center;

    box-sizing: border-box;

    gap: 2.08vw;

    padding-top: 30px;

    margin-bottom: 100px;
`

export const Info = styled.div<{$background?: string; $border: string; $color:string}> `
    display: flex;
    flex: 1;
    flex-direction: column;

    box-sizing: border-box;

    padding: 30px;

    gap: 40px;

    height: 400px;

    border-radius: 20px;

    background-color:  ${(props) => props.$background};
    border: 1px solid ${(props) => props.$border};

    color: ${(props) => props.$color};
`