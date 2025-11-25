import styled from "styled-components";

export const HeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 80px;
    background-color: rgba(0,0,0,0);
    align-items: center;
    justify-content: flex-end;
    box-sizing: border-box;
    padding: 2.08vw;
    gap: 0.5vw;
    position: relative; /* necessário para posicionar o dropdown */
    font-famiily: 'ubuntu', sans-serif;
`;

export const ProfileButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.6rem;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    color: inherit;
    h2 {
        margin: 0;
        font-size: 1.2rem;
    }
`;

export const DropdownContainer = styled.div`
    position: absolute;
    right: 2.08vw;
    top: calc(70% + 8px);
    z-index: 50;
`;

export const DropdownMenu = styled.div`
    background: #fff;
    border-radius: 12px;
    padding: 0.6rem;
    box-shadow: 0 6px 12px rgba(0,0,0,0.12);
    min-width: 220px;
`;

export const DropdownItem = styled.button`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    background: transparent;
    border: none;
    padding: 0.8rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.05rem;
    &:hover {
        background: rgba(0,0,0,0.03);
    }
`;