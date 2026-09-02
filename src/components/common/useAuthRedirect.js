import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../appwrite/auth';
import { login } from '../../data/slices/authSlice';

/**
 * Checks if a user is already authenticated on mount and redirects to /dashboard.
 * Also re-checks when the window regains focus (e.g. after OAuth popup closes).
 *
 * @param {boolean} redirectIfAuth — If true, redirects authenticated users to /dashboard
 */
export function useAuthRedirect(redirectIfAuth = true) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        let ignore = false;
        const checkUser = async () => {
            if (ignore) return;
            try {
                const userData = await authService.getCurrentUser();
                if (!ignore && userData) {
                    dispatch(login(userData));
                    if (redirectIfAuth) {
                        navigate('/dashboard');
                    }
                }
            } catch {
                // Not authenticated — do nothing
            }
        };

        checkUser();
        window.addEventListener('focus', checkUser);
        return () => {
            ignore = true;
            window.removeEventListener('focus', checkUser);
        };
    }, [dispatch, navigate, redirectIfAuth]);
}
