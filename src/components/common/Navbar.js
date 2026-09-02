import { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from './ThemeToggle';
import NavLinkItem from './NavLinkItem';

const Navbar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    const [mobileOpen, setMobileOpen] = useState(false);
    const closeMobile = () => setMobileOpen(false);

    return (
        <header className="fixed min-w-[100vw] bg-white/80 dark:bg-[#0a0f1e] backdrop-blur-2xl dark:backdrop-blur-2xl border-b border-[var(--border-color)]/60 dark:border-[var(--border-color)]/40 shadow-sm dark:shadow-[0_1px_0_0_rgba(var(--theme-color-rgb),0.04),0_4px_24px_-4px_rgba(0,0,0,0.5)] top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-[56px]">
                <Link to={'/dashboard'} className="flex items-center gap-2.5 text-[var(--text-primary)] hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-lg themeBg flex items-center justify-center">
                        <i className="fa-solid fa-address-card text-white text-sm"></i>
                    </div>
                    <span className="text-lg font-bold tracking-tight">CardCraft</span>
                </Link>

                <nav className="hidden sm:flex items-center gap-1">
                    <NavLinkItem to="/dashboard" isActive={isActive('/dashboard')} onClick={closeMobile}>
                        <i className="fa-regular fa-grid-2 mr-2"></i>Dashboard
                    </NavLinkItem>
                    <NavLinkItem to="/card" isActive={isActive('/card')} onClick={closeMobile}>
                        <i className="fa-regular fa-plus mr-2"></i>New Card
                    </NavLinkItem>
                    <div className="w-px h-6 bg-[var(--border-color)] mx-2 hidden sm:block"></div>
                    <ThemeToggle />
                    <NavLinkItem to="/logout" isActive={isActive('/logout')} onClick={closeMobile} variant="danger">
                        <i className="fa-regular fa-arrow-right-from-bracket"></i>
                    </NavLinkItem>
                </nav>

                <div className="flex sm:hidden items-center gap-2">
                    <ThemeToggle />
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] transition-all duration-200"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            {mobileOpen ? (
                                <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                            ) : (
                                <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <div className="sm:hidden border-t border-[var(--border-color)] bg-[var(--bg-tertiary)] dark:bg-[#0a0f1e] dark:border-[var(--border-color)]/40 backdrop-blur-xl px-4 py-3 space-y-2 slide-up">
                    <div className="flex flex-col gap-1">
                        <NavLinkItem to="/dashboard" isActive={isActive('/dashboard')} onClick={closeMobile}>
                            <i className="fa-regular fa-grid-2 mr-3 w-5 text-center"></i>Dashboard
                        </NavLinkItem>
                        <NavLinkItem to="/card" isActive={isActive('/card')} onClick={closeMobile}>
                            <i className="fa-regular fa-plus mr-3 w-5 text-center"></i>New Card
                        </NavLinkItem>
                        <div className="border-t border-[var(--border-color)] my-1"></div>
                        <NavLinkItem to="/logout" isActive={isActive('/logout')} onClick={closeMobile} variant="danger">
                            <i className="fa-regular fa-arrow-right-from-bracket mr-3 w-5 text-center"></i>Sign Out
                        </NavLinkItem>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
