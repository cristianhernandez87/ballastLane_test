// /frontend/src/context/AuthContext.tsx
import React, { createContext, useContext, useState, type ReactNode } from 'react';
import api from '../api/axios';
import type { AuthContextType } from '../types';

// Clave para guardar en localStorage
const AUTH_KEY = 'pokemon-user-logged-in';

// Valor por defecto para el contexto
const defaultAuthValue: AuthContextType = {
    isLoggedIn: localStorage.getItem(AUTH_KEY) === 'true',
    login: async () => false,
    logout: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthValue);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(defaultAuthValue.isLoggedIn);

    // Función de Login
    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            // Llama a tu backend /api/login [cite: 10]
            const response = await api.post('/login', { username, password });

            // Valida credenciales admin/admin [cite: 11]
            if (response.data.success) {
                localStorage.setItem(AUTH_KEY, 'true'); // Persistencia 
                setIsLoggedIn(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error en el login:", error);
            localStorage.removeItem(AUTH_KEY);
            setIsLoggedIn(false);
            return false;
        }
    };

    // Función de Logout
    const logout = () => {
        localStorage.removeItem(AUTH_KEY);
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto fácilmente
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);