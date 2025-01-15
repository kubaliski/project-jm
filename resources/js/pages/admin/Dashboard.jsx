import React, { useState, useEffect } from 'react';
import { useAuth } from '@context/AuthContext';
import { adminPostsService, adminContactsService } from '@services/api';

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        total_posts: 0,
        total_contacts: 0,
        total_visits: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            try {
                const [postsResponse, contactsResponse] = await Promise.all([
                    adminPostsService.count(),
                    adminContactsService.count()
                ]);

                setStats({
                    total_posts: postsResponse.data.total_posts,
                    total_contacts: contactsResponse.data.total_contacts,
                    total_visits: 0 // Mantenemos esto en 0 hasta que tengamos el endpoint
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Componente para las tarjetas de estadísticas
    const StatCard = ({ title, value, color, description, isLoading }) => (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
                <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                    <div className={`mt-1 text-3xl font-semibold text-${color}-600`}>
                        {isLoading ? (
                            <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
                        ) : (
                            value
                        )}
                    </div>
                </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">
                {description}
            </p>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Cabecera de bienvenida */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Bienvenido, {user?.name}
                </h1>
                <p className="mt-1 text-gray-600">
                    Este es tu panel de administración.
                </p>
            </div>

            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Posts"
                    value={stats.total_posts}
                    color="indigo"
                    description="Total de posts publicados"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Comunicaciones"
                    value={stats.total_contacts}
                    color="green"
                    description="Total de comunicaciones recibidas"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Visitas"
                    value={stats.total_visits}
                    color="purple"
                    description="Visitas totales"
                    isLoading={isLoading}
                />
            </div>

            {/* Actividad reciente */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Actividad reciente</h2>
                <div className="border-t border-gray-200">
                    <p className="py-4 text-gray-500 text-sm">No hay actividad reciente</p>
                </div>
            </div>
        </div>
    );
}