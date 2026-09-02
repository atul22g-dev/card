import { useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { login } from "../../data/slices/authSlice";
import { useForm } from 'react-hook-form'
import { handleErrors } from "../func/AllFunc";
import { authService } from "../../appwrite/auth";
import { NavLink } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import AuthLayout from "../common/AuthLayout";
import { AuthSubmitButton, PasswordField } from "./Login";
import { useAuthRedirect } from "../common/useAuthRedirect";

const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const signupRef = useRef({});
    const [isSubmit, setisSubmit] = useState(false);
    const { register, handleSubmit } = useForm()
    const updateform = (name, value) => { signupRef.current = { ...signupRef.current, [name]: value }; }

    useAuthRedirect();

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
                    <label htmlFor="signup-name" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Full Name</label>
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
                            id="signup-name"
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="text-left">
                    <label htmlFor="signup-email" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Email Address</label>
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
                            id="signup-email"
                        />
                    </div>
                </div>

                {/* Password */}
                <PasswordField
                    id="signup-password"
                    placeholder="Create a strong password"
                    register={register}
                    updateform={updateform}
                    validation={{
                        required: { value: true, message: "Password is Required" },
                        minLength: { value: 8, message: 'Password must be at least 8 characters' },
                    }}
                />

                <AuthSubmitButton label="Create Account" isSubmit={isSubmit} />
            </form>
        </AuthLayout>
    );
};

export default Signup
