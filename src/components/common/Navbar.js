import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    const [mobileOpen, setMobileOpen] = useState(false);

    const navLinks = (
        <>
            <Link
                to={'/dashboard'}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/dashboard') ? 'themeLgbg textTheme' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'}`}
            >
                <i className="fa-regular fa-grid-2 mr-2"></i>
                Dashboard
            </Link>
            <Link
                to={'/card'}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/card') ? 'themeLgbg textTheme' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'}`}
            >
                <i className="fa-regular fa-plus mr-2"></i>
                New Card
            </Link>
            <div className="w-px h-6 bg-[var(--border-color)] mx-2 hidden sm:block"></div>
            <ThemeToggle />
            <Link
                to={'/logout'}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200"
            >
                <i className="fa-regular fa-arrow-right-from-bracket"></i>
            </Link>
        </>
    );

    return (
        <header className="fixed min-w-[100vw] bg-white dark:bg-[var(--bg-primary)] border-b border-[var(--border-color)] shadow-sm top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
                <Link to={'/dashboard'} className="flex items-center gap-2.5 text-[var(--text-primary)] hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-lg themeBg flex items-center justify-center">
                        <i className="fa-solid fa-address-card text-white text-sm"></i>
                    </div>
                    <span className="text-lg font-bold tracking-tight">CardCraft</span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden sm:flex items-center gap-1">
                    {navLinks}
                </nav>

                {/* Mobile hamburger */}
                <div className="flex sm:hidden items-center gap-2">
                    <ThemeToggle />
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] transition-all duration-200"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            {mobileOpen ? (
                                <>
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </>
                            ) : (
                                <>
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <line x1="3" y1="12" x2="21" y2="12" />
                                    <line x1="3" y1="18" x2="21" y2="18" />
                                </>
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu dropdown */}
            {mobileOpen && (
                <div className="sm:hidden border-t border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 space-y-2 slide-up">
                    <div className="flex flex-col gap-1">
                        <Link
                            to={'/dashboard'}
                            onClick={() => setMobileOpen(false)}
                            className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/dashboard') ? 'themeLgbg textTheme' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}
                        >
                            <i className="fa-regular fa-grid-2 mr-3 w-5 text-center"></i>
                            Dashboard
                        </Link>
                        <Link
                            to={'/card'}
                            onClick={() => setMobileOpen(false)}
                            className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/card') ? 'themeLgbg textTheme' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}
                        >
                            <i className="fa-regular fa-plus mr-3 w-5 text-center"></i>
                            New Card
                        </Link>
                        <div className="border-t border-[var(--border-color)] my-1"></div>
                        <Link
                            to={'/logout'}
                            onClick={() => setMobileOpen(false)}
                            className="block px-4 py-2.5 rounded-lg text-sm font-medium text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200"
                        >
                            <i className="fa-regular fa-arrow-right-from-bracket mr-3 w-5 text-center"></i>
                            Sign Out
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;