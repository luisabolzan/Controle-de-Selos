import styled, { css } from 'styled-components';

export const SideBarContainer = styled.div<{ expanded?: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    box-sizing: border-box;
    padding: 10px;
    padding-top: 24px;
    padding-bottom: 24px;
    gap: 24px;

    width: ${p => (p.expanded ? '250px' : '100px')};
    min-width: ${p => (p.expanded ? '250px' : '80px')};
    min-height: 100vh;
    background-color: #000000;
    transition: width 300ms ease;
    overflow: hidden;
`;

/* Toggle button area */
export const MenuToggleButton = styled.button`
    background: transparent;
    border: none;
    padding: 8px;
    margin-left: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
`;

/* Custom 3-bar icon that rotates 90deg and becomes vertical */
export const MenuBars = styled.div`
    width: 28px;
    height: 20px;
    position: relative;
    transition: transform 300ms ease;
    display: inline-block;

    &::before,
    &::after,
    div {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        height: 3px;
        background: #FFFFFF;
        border-radius: 2px;
        transition: transform 300ms ease, top 300ms ease, opacity 200ms ease;
    }

    /* top line */
    &::before {
        top: 0;
    }
    /* middle line (use inner div) */
    div {
        top: 8.5px;
    }
    /* bottom line */
    &::after {
        top: 17px;
    }

    /* When open rotate the whole icon 90deg to make bars vertical */
    &.open {
        transform: rotate(90deg);
    }

    /* slight spacing changes while rotating to maintain visual */
    &.open::before {
        top: 0;
    }
    &.open div {
        top: 7.5px;
    }
    &.open::after {
        top: 15px;
    }
`;

/* Navigation list and items */
export const NavList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
`;

export const NavItem = styled.li`
    width: 100%;
    display: flex;
    align-items: center;
    padding: 6px 12px;
`;

/* The text that fades in/out. When not visible it remains out of sight but doesn't reflow layout (overflow hidden from container). */
export const ItemText = styled.span<{ visible?: boolean }>`
    color: #FFFFFF;
    font-size: 1rem;
    white-space: nowrap;
    display: inline-block;
    transform-origin: left center;
    transition: opacity 220ms ease, transform 220ms ease;
    opacity: ${p => (p.visible ? 1 : 0)};
    transform: ${p => (p.visible ? 'translateX(0)' : 'translateX(-8px)')};
    pointer-events: ${p => (p.visible ? 'auto' : 'none')};
    cursor: ${p => (p.visible ? 'pointer' : 'default')};
`;

/* Logo sizing: keep at bottom similar to original */
export const LogoImage = styled.img`
    margin-top: auto;
    margin-left: 12px;
    height: auto;
    width: 3.1vw;
    min-width: 50px;
    opacity: 0.95;
`;

/* helper to render the inner middle bar (MenuBars expects a child div for the center line) */
export const _MenuBarsInner = css``;