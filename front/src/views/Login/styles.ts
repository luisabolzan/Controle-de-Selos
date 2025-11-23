import { execFileSync } from 'child_process';
import styled from 'styled-components';


export const LoginContainer = styled.div `

    display: flex;
    flex-direction: column;

    background-color: #D7D6D6;

    width: 100%;
    height: 100vh;
    
    box-sizing: border-box;

    justify-content: center;
    align-items: center;

    font-family: 'Ubuntu', sans-serif;

    h1 {
        font-size: 35px;
        font-weight: normal;
        color: #000000;
        margin: 0;
    }

    h2{
        font-size: 18px;
        font-weight: 400;
        color: #000000;
        margin: 0;
    }

    h3{
        font-size: 20px;
        font-weight: 300;  text-align: center; /* ou left, right, justify */
        color: #8F8F8F;
        margin: 0;
    }

    h4{
        font-size: 18px;
        font-weight: 300;
        color: #8F8F8F;
        text-align: center;
        margin: 0;
    }

    h5{
        font-size: 18px;
        font-weight: 300;
        color: #ffffff;
        text-align: center;
        margin: 0;
    }
    
`

export const LoginForm = styled.form `
    display: flex;
    flex-direction: column;
    
    width: 580px;
    height: auto;

    justify-content: center;
    align-items: center;

    box-sizing: border-box;

    padding: 40px;
    gap: 30px;
`

export const HeaderForm = styled.form `
    display: flex;
    flex-direction: column;

    width: 100%;
    height: auto;

    justify-content: center;
    align-items: center;

    box-sizing: border-box;

    gap: 20px;

`

export const ImageStyle = styled.img `
    width: 339px;
    height: auto;
    margin: 0;
`

export const UsernameIpunt = styled.div `
    display: flex;
    flex-direction: row;

    width: 100%;
    height: 41px;
    
    gap: 5px;

    box-sizing: border-box;
`

export const DomainBox = styled.div<{ $width: string, $fontSize: string, $paddingRight: string}>`
    display: flex;

    width: ${({ $width }) => $width};
    height: 36px;

    font-size: ${({ $fontSize }) => $fontSize};
    font-family: 'ubuntu', sans-serif;

    box-sizing: border-box;
    background-color: #C12A23;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-right: ${({ $paddingRight }) => $paddingRight};
    padding-left: 24px;
    
    border-radius: 100px;

    align-items: center;
    justify-content: center;
`

export const InputsContainer = styled.div `
    display: flex;
    flex-direction: column;
    
    width: 100%;
    height: auto;
    
    box-sizing: border-box;
    gap: 20px;
    
    justify-content: center;
    align-items: center;
`

export const TextContainer = styled.div`
    gap: 8px;

    display: flex;
    flex-direction: row;
    align-items: center;

    width: 100%;

    div {
        border: none;
        border-bottom: 1px solid #000000;
        margin: 0;
        width: 100%;
    }
`;

export const AltOptions = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;

    width: 100%;
`;