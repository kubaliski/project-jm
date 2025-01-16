import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@hooks';
import { adminContactsService } from '@services/api';
import { StatCard } from '@components/common';
import { countPosts } from '@store/admin/thunks/postsThunks';
import {
    selectTotalPosts,
    selectStatsLoading,
} from '@store/admin/selectors/postsSelectors';

export default function Dashboard() {
    const dispatch = useDispatch();
    const { user, permissions } = useAuth();

    // Selectors para posts stats
    const totalPosts = useSelector(selectTotalPosts);
    const isPostsStatsLoading = useSelector(selectStatsLoading);

    const [contactStats, setContactStats] = React.useState({
        total_contacts: 0,
        loading: true
    });

    // Calculamos los permisos fuera del useEffect
    const canViewPostStats = permissions.includes('stats.posts');
    const canViewContactStats = permissions.includes('stats.contacts');

    useEffect(() => {
        let isMounted = true;

        const fetchStats = async () => {
            try {
                // Fetch posts stats si tiene permiso
                if (canViewPostStats) {
                    dispatch(countPosts());
                }

                // Fetch contacts stats si tiene permiso
                if (canViewContactStats && isMounted) {
                    const contactsResponse = await adminContactsService.count();
                    setContactStats({
                        total_contacts: contactsResponse.data.total_contacts,
                        loading: false
                    });
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
                if (isMounted) {
                    setContactStats(prev => ({ ...prev, loading: false }));
                }
            }
        };

        fetchStats();

        return () => {
            isMounted = false;
        };
    }, [dispatch, canViewPostStats, canViewContactStats]);

    // Obtenemos el nombre completo del usuario
    const fullName = user ? `${user.name} ${user.last_name}`.trim() : '';

    return (
        <div className="space-y-6">
            {/* Cabecera de bienvenida */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Bienvenido, {fullName}
                </h1>
                <p className="mt-1 text-gray-600">
                    Este es tu panel de administración.
                </p>
            </div>

            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {canViewPostStats && (
                    <StatCard
                        title="Posts"
                        value={totalPosts}
                        color="indigo"
                        description="Total de posts publicados"
                        isLoading={isPostsStatsLoading}
                    />
                )}

                {canViewContactStats && (
                    <StatCard
                        title="Comunicaciones"
                        value={contactStats.total_contacts}
                        color="green"
                        description="Total de comunicaciones recibidas"
                        isLoading={contactStats.loading}
                    />
                )}
            </div>

            {/* Actividad reciente */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Actividad reciente
                </h2>
                <div className="border-t border-gray-200">
                    <p className="py-4 text-gray-500 text-sm">
                        No hay actividad reciente
                    </p>
                </div>
            </div>
        </div>
    );
}