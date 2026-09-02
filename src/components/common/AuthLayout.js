
import ThemeToggle from './ThemeToggle';
import { authService } from '../../appwrite/auth';

const AuthLayout = ({ title, subtitle, children, footer }) => {
    return (
        <section className="min-h-screen flex justify-center items-center px-4 py-8 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, var(--bg-secondary) 0%, var(--bg-tertiary) 35%, var(--bg-secondary) 70%, var(--bg-tertiary) 100%)' }}>
            {/* Mesh gradient background — layered ambient glows */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-[var(--theme-color)] blur-[120px] opacity-[0.15] animate-pulse" style={{ animationDuration: '4s' }}></div>
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-[var(--theme-color)] blur-[120px] opacity-[0.12] animate-pulse" style={{ animationDuration: '6s' }}></div>
                <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-indigo-400 blur-[110px] opacity-[0.08]"></div>
                {/* Subtle grid pattern overlay */}
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, var(--text-primary) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
            </div>

            {/* Theme toggle — top-right corner */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-[460px] relative">
                {/* Animated glow ring behind card */}
                <div className="absolute -inset-1 rounded-[22px] bg-gradient-to-r from-[var(--theme-color)] via-indigo-400 to-purple-400 opacity-20 blur-lg animate-pulse" style={{ animationDuration: '3s' }}></div>

                <div className="relative bg-[var(--bg-primary)] rounded-[20px] px-5 py-10 sm:px-10 sm:py-12 text-center overflow-hidden scale-in border border-[var(--border-color)]/60" style={{ boxShadow: 'var(--shadow-2xl), 0 0 80px rgba(var(--theme-color-rgb), 0.1), 0 0 160px rgba(var(--theme-color-rgb), 0.04)' }}>
                    {/* Top accent bar — animated gradient */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--theme-color)] via-indigo-400 to-purple-400"></div>

                    {/* Decorative corner accent */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[var(--theme-color)] opacity-[0.03] blur-2xl"></div>

                    {/* Logo / heading area */}
                    <div className="mb-7">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--theme-color)] to-[color-mix(in_srgb,var(--theme-color)_70%,#6366f1)] mb-4 shadow-lg shadow-[var(--theme-color)]/20">
                            <i className="fa-solid fa-address-card fa-xl text-white"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">{title}</h2>
                        {subtitle && (
                            <p className="text-sm text-[var(--text-muted)] mt-1.5">{subtitle}</p>
                        )}
                    </div>

                    {/* Form contents */}
                    {children}

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[var(--border-color)]"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-[var(--bg-primary)] px-4 text-[var(--text-muted)] font-medium">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    {/* OAuth buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => authService.createAccountAuth('github')}
                            className="auth-oauth-btn group"
                        >
                            <i className="fa-brands fa-github text-lg group-hover:scale-110 transition-transform"></i>
                            <span>GitHub</span>
                        </button>
                        <button
                            onClick={() => authService.createAccountAuth('google')}
                            className="auth-oauth-btn group"
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span>Google</span>
                        </button>
                    </div>

                    {/* Footer link */}
                    {footer && (
                        <div className="mt-6">
                            <p className="text-sm text-[var(--text-muted)]">{footer}</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AuthLayout;
