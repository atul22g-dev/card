import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { togglePassword } from "../../data/slices/togglePassord";
import { useForm } from 'react-hook-form'
import { handleErrors } from "../func/AllFunc";
import { authService } from "../../appwrite/auth";
import { NavLink } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import ThemeToggle from "../common/ThemeToggle";
import { login } from "../../data/slices/authSlice";


const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [signup, setSignup] = useState({});
    const [isSubmit, setisSubmit] = useState(false)
    const icon = useSelector(state => state.togglePassord.icon);
    const type = useSelector(state => state.togglePassord.type);
    const { register, handleSubmit, formState: { errors } } = useForm()
    const updateform = (name, value) => setSignup({ ...signup, [name]: value })

    useEffect(() => {
        const handleGetUser = async () => {
            const userData = await authService.getCurrentUser();
            if (userData) {
                window.location.href = '/dashboard'
            }
        }
        handleGetUser()
    }, [])


    const create = async (data) => {
        try {
            setisSubmit(true)
            const userData = await authService.createAccount(data)
            if (userData.status) {
                dispatch(login(userData))
                navigate('/dashboard')
            }
            setisSubmit(false)
        } catch (error) {
            handleErrors({ message: error.message })
        }
    }
    return (
        <section className="min-h-screen themeLgbg flex justify-center items-center px-4 py-8 relative">
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                <ThemeToggle />
            </div>
            <div className="w-full max-w-[480px]">
                <div className="relative bg-[var(--bg-primary)] rounded-2xl shadow-xl px-5 py-10 sm:px-12 sm:py-14 text-center overflow-hidden">
                    {/* Decoration */}
                    <div className="absolute top-0 left-0 w-full h-1.5 themeBg"></div>
                    
                    {/* Logo/Icon area */}
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl themeLgbg mb-4">
                            <i className="fa-solid fa-address-card fa-2xl textTheme"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Create Account</h2>
                        <p className="text-sm text-[var(--text-muted)] mt-1">Start designing your digital business card</p>
                    </div>

                    <form onSubmit={handleSubmit(create)} className="space-y-5">
                        <div className="text-left">
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Full Name</label>
                            <div className="relative">
                                <i className="fa-regular fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm"></i>
                                <input
                                    type='text'
                                    placeholder="John Doe"
                                    {...register("name", {
                                        required: { value: true, message: "Name is Required" },
                                        minLength: { value: 3, message: 'Name must be at least 3 characters' },
                                    })}
                                    onChange={(e) => updateform(e.target.name, e.target.value)}
                                    className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] pl-10 pr-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--theme-color)] focus:ring-2 focus:ring-[var(--light-theme-color)] transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div className="text-left">
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Email Address</label>
                            <div className="relative">
                                <i className="fa-regular fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm"></i>
                                <input
                                    type='text'
                                    placeholder="you@example.com"
                                    {...register("email", {
                                        required: { value: true, message: "Email is Required" },
                                        validate: {
                                            matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                                "Email address must be a valid address",
                                        }
                                    })}
                                    onChange={(e) => updateform(e.target.name, e.target.value)}
                                    className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] pl-10 pr-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--theme-color)] focus:ring-2 focus:ring-[var(--light-theme-color)] transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div className="text-left">
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Password</label>
                            <div className="relative">
                                <i className="fa-regular fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm"></i>
                                <input
                                    type={type}
                                    placeholder="Create a strong password"
                                    {...register("password", {
                                        required: { value: true, message: "Password is Required" },
                                        minLength: { value: 8, message: 'Password must be at least 8 characters' },
                                    })}
                                    onChange={(e) => updateform(e.target.name, e.target.value)}
                                    className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] pl-10 pr-12 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--theme-color)] focus:ring-2 focus:ring-[var(--light-theme-color)] transition-all duration-200"
                                />
                                <button type="button" onClick={() => dispatch(togglePassword('togger'))} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
                                    <i className={`fa-regular ${icon === 'fa-eye' ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                                </button>
                            </div>
                        </div>

                        <div className="relative pt-2">
                            {isSubmit && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--bg-primary)]/80 rounded-xl">
                                    <div className="flex items-center gap-3 text-[var(--theme-color)]">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                        </svg>
                                        <span className="text-sm font-medium">Creating account...</span>
                                    </div>
                                </div>
                            )}
                            <button
                                disabled={isSubmit}
                                type="submit"
                                onClick={() => handleErrors(errors)}
                                className="w-full rounded-xl themeBg text-white px-5 py-3 text-sm font-semibold transition-all duration-200 hover:brightness-90 hover:shadow-lg hover:shadow-[var(--theme-color)]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Create Account
                            </button>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[var(--border-color)]"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-[var(--bg-primary)] px-4 text-[var(--text-muted)]">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => { authService.createAccountAuth('github') }} className="flex items-center justify-center gap-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:border-[var(--text-muted)] transition-all duration-200">
                            <i className="fa-brands fa-github text-lg"></i>
                            <span>GitHub</span>
                        </button>
                        <button onClick={() => { authService.createAccountAuth('google') }} className="flex items-center justify-center gap-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:border-[var(--text-muted)] transition-all duration-200">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                              </svg>
                            <span>Google</span>
                        </button>
                    </div>

                    <p className="mt-6 text-sm text-[var(--text-muted)]">
                        <span>Already have an account? </span>
                        <NavLink to={'/'} className="font-semibold textTheme hover:underline">
                            Sign in
                        </NavLink>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Signup