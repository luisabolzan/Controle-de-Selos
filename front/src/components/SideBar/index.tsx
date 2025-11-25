import React, { useEffect, useRef, useState } from "react";
import { SideBarProps } from "./types";
import { LogoImage, SideBarContainer, MenuToggleButton, MenuBars, NavList, NavItem, ItemText } from "./styles";
import LogoINF from "../../assets/logo-INF-White.png";
import { useNavigate } from "react-router-dom";

const SideBar: React.FC<SideBarProps> = ({}: SideBarProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const compactMenuRef = useRef<HTMLDivElement | null>(null);

    function toggle() {
        setIsExpanded(s => !s);
    }

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (!compactMenuRef.current) return;
            if (!(e.target instanceof Node)) return;
            if (!compactMenuRef.current.contains(e.target)) setIsExpanded(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const navigate = useNavigate();

    return (
        <SideBarContainer ref={compactMenuRef} expanded={isExpanded}>
            <MenuToggleButton onClick={toggle} aria-expanded={isExpanded}>
                <MenuBars className={isExpanded ? "open" : ""} />
            </MenuToggleButton>

            <NavList>
                <NavItem>
                    <ItemText visible={isExpanded} onClick={() => navigate("/")}>→ Nova Solicitação</ItemText>
                </NavItem>
                <NavItem>
                    <ItemText visible={isExpanded} onClick={() => navigate("/")}>→ Minhas Solicitações</ItemText>
                </NavItem>
                <NavItem>
                    <ItemText visible={isExpanded} onClick={() => navigate("/")}>→ Meus Selos</ItemText>
                </NavItem>
            </NavList>

            <LogoImage src={LogoINF} alt="INF logo" />
        </SideBarContainer>
    );
};

export default SideBar;