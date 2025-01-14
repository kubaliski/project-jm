import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await window.axios.post('/api/login', credentials);
            setUser(response.data.user);
            const token = response.data.token;
            window.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
            return true;
        } catch (error) {
            console.error('Error en login:', error);
            return false;
        }
    };

    const logout = async () => {
        try {
            // Primero hacemos la petición con el token aún válido
            await window.axios.post('/api/logout');
        } catch (error) {
            console.error('Error en logout:', error);
        } finally {
            // Después de la petición (exitosa o no), limpiamos todo
            setUser(null);
            localStorage.removeItem('token');
            delete window.axios.defaults.headers.common['Authorization'];
        }
    };


    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                window.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const response = await window.axios.get('/api/user');
                setUser(response.data);
            }
        } catch (error) {
            setUser(null);
            localStorage.removeItem('token');
            delete window.axios.defaults.headers.common['Authorization'];
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