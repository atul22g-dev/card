import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { togglePassword } from "../../data/slices/togglePassord";
import { useForm } from 'react-hook-form'
import { handleErrors } from "../func/AllFunc";
import { authService } from "../../appwrite/auth";
import { NavLink } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { login } from "../../data/slices/authSlice";
import AuthLayout from "../common/AuthLayout";

const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [signup, setSignup] = useState({});
    const [isSubmit, setisSubmit] = useState(false);
    const icon = useSelector(state => state.togglePassord.icon);
    const type = useSelector(state => state.togglePassord.type);
    const { register, handleSubmit, formState: { errors } } = useForm()
    const updateform = (name, value) => setSignup({ ...signup, [name]: value })

    useEffect(() => {
        const handleGetUser = async () => {
            const userData = await authService.getCurrentUser();
            if (userData) window.location.href = '/dashboard'
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
        <AuthLayout
            title="Create Account"
            subtitle="Start designing your digital business card"
            footer={
                <>
                    <span>Already have an account? </span>
                    <NavLink to={'/'} className="font-semibold textTheme hover:underline">Sign in</NavLink>
                </>
            }
        >
            <form onSubmit={handleSubmit(create)} className="space-y-5">
                {/* Full Name */}
                <div className="text-left">
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Full Name</label>
                    <div className="relative">
                        <i className="fa-regular fa-user auth-input-icon"></i>
                        <input
                            type='text' placeholder="John Doe"
                            {...register("name", {
                                required: { value: true, message: "Name is Required" },
                                minLength: { value: 3, message: 'Name must be at least 3 characters' },
                            })}
                            onChange={(e) => updateform(e.target.name, e.target.value)}
                            className="auth-input"
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="text-left">
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Email Address</label>
                    <div className="relative">
                        <i className="fa-regular fa-envelope auth-input-icon"></i>
                        <input
                            type='text' placeholder="you@example.com"
                            {...register("email", {
                                required: { value: true, message: "Email is Required" },
                                validate: { matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || "Email address must be a valid address" }
                            })}
                            onChange={(e) => updateform(e.target.name, e.target.value)}
                            className="auth-input"
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="text-left">
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Password</label>
                    <div className="relative">
                        <i className="fa-regular fa-lock auth-input-icon"></i>
                        <input
                            type={type} placeholder="Create a strong password"
                            {...register("password", {
                                required: { value: true, message: "Password is Required" },
                                minLength: { value: 8, message: 'Password must be at least 8 characters' },
                            })}
                            onChange={(e) => updateform(e.target.name, e.target.value)}
                            className="auth-input"
                            style={{ paddingRight: '48px' }}
                        />
                        <button
                            type="button"
                            onClick={() => dispatch(togglePassword('togger'))}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                        >
                            <i className={`fa-regular ${icon === 'fa-eye' ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                        </button>
                    </div>
                </div>

                {/* Submit */}
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
                    <button disabled={isSubmit} type="submit" onClick={() => handleErrors(errors)} className="auth-submit-btn">
                        Create Account
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Signup
