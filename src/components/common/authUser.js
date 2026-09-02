import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {authService} from '../../appwrite/auth';
import { login } from '../../data/slices/authSlice';

export const AuthUser = ({ children, authentication = true }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    useEffect(() => {
        let ignore = false;
        const getUser = async () => {
            try {
                const userData = await authService.getCurrentUser()
                if (ignore) return;
                dispatch(login(userData))
                if (userData == null && authentication) {
                    navigate("/signup")
                }
                setLoader(false)
            } catch (error) {
                if (!ignore) {
                    console.error('Auth check failed:', error);
                    setLoader(false);
                }
            }
        }
        getUser()
        return () => { ignore = true; };
    }, [authentication, dispatch, navigate])

    return (
        loader ? (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-xl themeBg flex items-center justify-center pulse-ring">
                        <i className="fa-solid fa-spinner text-white animate-spin"></i>
                    </div>
                    <p className="text-sm text-[var(--text-muted)]">Loading your account...</p>
                </div>
            </div>
        ) : <>{children}</>
    )
}

export default AuthUser