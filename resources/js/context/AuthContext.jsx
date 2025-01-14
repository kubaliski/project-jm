import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';
import { authClient } from '../services/api/httpClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);

            // Guardamos el usuario del response
            setUser(response.data.user);

            // Guardamos el token
            const token = response.data.token;
            localStorage.setItem('token', token);

            // No necesitamos setear el token en axios porque
            // el interceptor en httpClient lo maneja automáticamente

            return true;
        } catch (error) {
            console.error('Error en login:', error);
            return false;
        }
    };

    const logout = async () => {
        try {
            // Intentamos hacer logout en el servidor
            await authService.logout();
        } catch (error) {
            console.error('Error en logout:', error);
        } finally {
            // Limpiamos el estado local independientemente del resultado
            setUser(null);
            localStorage.removeItem('token');
            // No necesitamos limpiar los headers de axios porque
            // el interceptor en httpClient lo maneja automáticamente
        }
    };

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                // No necesitamos setear el token en axios porque
                // el interceptor en httpClient lo maneja automáticamente
                const response = await authService.getCurrentUser();
                setUser(response.data);
            }
        } catch (error) {
            setUser(null);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);