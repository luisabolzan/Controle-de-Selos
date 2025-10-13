import { execFileSync } from 'child_process';
import styled from 'styled-components';


export const Container = styled.div `
    display: flex;
    flex-direction: column;

    box-sizing: border-box;

    width: 100%;
    min-width: 360px;
    min-height: 100vh;  
`

export const ServiceContainer = styled.div`
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

    h6 {
    font-size: clamp(12px, 10px + 0.8vw, 15px);
    font-weight: 400;
    margin: 0;
    color: #C12A23
    }
`

export const MainContainer = styled.div`
    display: flex;
    flex-direction: column;

    width: 100%;
    height: 100%;

    align-items: center;

    box-sizing: border-box;
    padding-bottom: 20px;

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

export const CardsContainer = styled.div`
    display: flex;
    flex-direction:row;
    width: 90%;

    box-sizing: border-box;
    padding-top: 50px;
    padding-bottom: 150px;
    gap: 50px;

    justify-content: flex-start;
    align-items: flex-start;

    @media (max-width: 1230px) {
        flex-direction:column;
    }
`
export const GridCardsContainer = styled.div`
    display: flex;
    flex-direction: column;

    width: 100%;

    justify-content: center;
    align-items: center;

`

export const RequestCardsContainer = styled.div`

    box-sizing: border-box;

    display: grid;
    grid-template-columns: repeat(4, 1fr); 
    gap: 40px 40px;

    width: 100%;

    @media (max-width: 1900px) {
        grid-template-columns: repeat(3, 1fr); 
    }

    @media (max-width: 1612px) {
        grid-template-columns: repeat(2, 1fr); 
    }

    @media (max-width: 1230px) {
      grid-template-columns: repeat(1, 1fr); 
    }


`