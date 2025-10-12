import { execFileSync } from 'child_process';
import styled from 'styled-components';


export const Container = styled.div `
    display: flex;
    flex-direction: column;

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

export const FormContainer = styled.div`
    display: flex;
    flex-direction:column;

    width: 90%;
    height: 350px;

    box-sizing: border-box;
    padding-top: 50px;
    gap: 20px;

    justify-content: top;

`

export const ButtonContainer = styled.div`
    display: flex;
    flex-direction:row;

    width: 90%;
    height: 70px;

    align-items:center;
    justify-content: right;

`