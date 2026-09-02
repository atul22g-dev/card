import { useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form'
import { handleErrors } from "../func/AllFunc";
import { NavLink } from "react-router-dom";
import { authService } from "../../appwrite/auth";
import { login } from "../../data/slices/authSlice"
import { useNavigate } from 'react-router-dom';
import AuthLayout from "../common/AuthLayout";
import { useAuthRedirect } from "../common/useAuthRedirect";

export const AuthSubmitButton = ({ label, isSubmit }) => (
  <div className="relative pt-2">
    {isSubmit && (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--bg-primary)]/80 rounded-xl">
        <div className="flex items-center gap-3 text-[var(--theme-color)]">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <span className="text-sm font-medium">{isSubmit ? `${label}...` : label}</span>
        </div>
      </div>
    )}
    <button disabled={isSubmit} type="submit" className="auth-submit-btn">
      {label}
    </button>
  </div>
);

export const PasswordField = ({ id, placeholder, register, updateform, validation }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="text-left">
      <label htmlFor={id} className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Password</label>
      <div className="relative">
        <i className="fa-regular fa-lock auth-input-icon"></i>
        <input
          type={showPassword ? 'text' : 'password'} placeholder={placeholder}
          {...register("password", validation)}
          onChange={(e) => updateform(e.target.name, e.target.value)}
          className="auth-input"
          id={id}
          style={{ paddingRight: '48px' }}
        />
        <button
          type="button"
          onClick={() => setShowPassword(p => !p)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          aria-label="Toggle password visibility"
        >
          <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
        </button>
      </div>
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logindataRef = useRef({});
  const [isSubmit, setisSubmit] = useState(false);
  const { register, handleSubmit } = useForm()
  const updateform = (name, value) => { logindataRef.current = { ...logindataRef.current, [name]: value }; }

  useAuthRedirect();

  const loginFunc = async (data) => {
    try {
      setisSubmit(true)
      const userData = await authService.login(data)
      if (userData.status) {
        dispatch(login(userData))
        navigate('/dashboard')
      }
      setisSubmit(false)
    } catch (error) {
      setisSubmit(false)
      handleErrors({ message: error.message })
    }
  }

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue"
      footer={
        <>
          <span>Not a member yet? </span>
          <NavLink to={'/signup'} className="font-semibold textTheme hover:underline">
            Create an account
          </NavLink>
        </>
      }
    >
      <form onSubmit={handleSubmit(loginFunc)} className="space-y-5">
        {/* Email field */}
        <div className="text-left">
          <label htmlFor="login-email" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Email Address</label>
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
              id="login-email"
            />
          </div>
        </div>

        {/* Password field */}
        <PasswordField
          id="login-password"
          placeholder="Enter your password"
          register={register}
          updateform={updateform}
          validation={{
            required: { value: true, message: "Password is Required" },
            minLength: { value: 8, message: 'Password must be 8 characters' },
          }}
        />

        <AuthSubmitButton label="Sign In" isSubmit={isSubmit} />
      </form>
    </AuthLayout>
  );
};

export default Login
