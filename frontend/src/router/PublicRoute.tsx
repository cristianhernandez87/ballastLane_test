// /frontend/src/router/PublicRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Si el usuario SÍ está logueado, no puede ver el Login, lo redirige a /
export const PublicRoute = () => {
    const { isLoggedIn } = useAuth();
    return isLoggedIn ? <Navigate to="/" replace /> : <Outlet />;
};