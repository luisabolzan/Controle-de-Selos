import React from "react";
import { SideBarProps } from "./types";
import { LogoImage, SideBarContainer } from "./styles";
import { Menu } from 'lucide-react';
import LogoINF from "../../assets/marca-negativa-removebg-preview.png"

const SideBar: React.FC<SideBarProps> = ({}: SideBarProps) => {
   
    return ( 

        <SideBarContainer> 
            <Menu color="#FFFFFF" size="30px"/>
            <LogoImage src={LogoINF} />
        </SideBarContainer>

    );

};

export default SideBar;