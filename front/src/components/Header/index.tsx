import React from "react";
import { HeaderProps } from "./types"
import {HeaderContainer} from "./styles";
import { CircleUserRound, ChevronDown } from 'lucide-react';

const Header: React.FC<HeaderProps> = ({}: HeaderProps) => {
   
    return ( 

        <HeaderContainer> 
            <CircleUserRound/>
            <h2> Nome do Usuário</h2>
            <ChevronDown/>
        </HeaderContainer>

    );

};

export default Header;