// /frontend/src/context/AuthContext.tsx
import React, { createContext, useContext, useState, type ReactNode } from 'react';
import api from '../api/axios';
import type { AuthContextType } from '../types';

const AUTH_KEY = 'pokemon-user-logged-in';

const defaultAuthValue: AuthContextType = {
    isLoggedIn: localStorage.getItem(AUTH_KEY) === 'true',
    login: async () => false,
    logout: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthValue);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(defaultAuthValue.isLoggedIn);
    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const response = await api.post('/login', { username, password });
            if (response.data.success) {
                localStorage.setItem(AUTH_KEY, 'true'); 
                setIsLoggedIn(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error login:", error);
            localStorage.removeItem(AUTH_KEY);
            setIsLoggedIn(false);
            return false;
        }
    };

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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);