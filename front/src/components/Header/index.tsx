// ...existing code...
import React, { useEffect, useRef, useState } from "react";
import { HeaderProps } from "./types";
import { HeaderContainer, ProfileButton, DropdownContainer, DropdownMenu, DropdownItem } from "./styles";
import { CircleUserRound, ChevronDown, LogOut, ChevronUp } from "lucide-react";
import { useMemo } from "react";
import { logoutUser } from "../../api/functions";
import { useNavigate } from "react-router-dom";

const Header: React.FC<HeaderProps> = ({ userName = "Nome do usuário", onLogout }: HeaderProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const username = useMemo(() => {
        const name = localStorage.getItem('username');
        return name || 'Nome do usuário';
    }, []);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (!containerRef.current) return;
            if (!(e.target instanceof Node)) return;
            if (!containerRef.current.contains(e.target)) setIsOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function toggle() {
        setIsOpen((s) => !s);
    }
    
    const navigate = useNavigate()

    async function handleLogout() {
        await logoutUser();
        navigate("/");
    }

    return (
        <HeaderContainer ref={containerRef}>
            <ProfileButton onClick={toggle} aria-expanded={isOpen}>
                <CircleUserRound />
                <h2>{username}</h2>
                {isOpen? <ChevronDown /> : <ChevronUp />}
            </ProfileButton>

            {isOpen && (
                <DropdownContainer>
                    <DropdownMenu>
                        <DropdownItem onClick={handleLogout}>
                            <span>Sair</span>
                            <LogOut />
                        </DropdownItem>
                    </DropdownMenu>
                </DropdownContainer>
            )}
        </HeaderContainer>
    );
};

export default Header;
// ...existing code...