import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authService } from '../appwrite/auth';
import { logout } from '../data/slices/authSlice';

const Signout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const logoutFunc = async () => {
            // Clear the Redux auth state so no stale user data survives the sign-out
            dispatch(logout());
            try {
                await authService.logout();
                navigate('/');
            } catch (error) {
                navigate('/');
            }
        }
        logoutFunc();
    }, [navigate, dispatch])

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 rounded-xl themeBg flex items-center justify-center pulse-ring">
                    <i className="fa-solid fa-arrow-right-from-bracket text-white"></i>
                </div>
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    <span className="text-sm">Signing out...</span>
                </div>
            </div>
        </div>
    )
}

export default Signout