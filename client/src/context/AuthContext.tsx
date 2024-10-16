// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkAuth, logout } from '../services/authService';

interface AuthContextType {
    isAuthenticated: boolean;
    checkUserAuth: () => void;
    logOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check user authentication status
    const checkUserAuth = async () => {
        const result = await checkAuth();
        setIsAuthenticated(!!result);
    };

    // Log out user
    const logOut = async () => {
        await logout();
        setIsAuthenticated(false);
    };

    // Check auth status on initial render
    useEffect(() => {
        checkUserAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, checkUserAuth, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
