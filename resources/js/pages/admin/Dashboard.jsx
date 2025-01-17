import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@hooks';
import { StatCard } from '@components/common';
import { countPosts } from '@store/admin/thunks/postsThunks';
import { countContacts } from '@store/admin/thunks/contactsThunks';
import {
    selectTotalPosts,
    selectPostStatsLoading,
} from '@store/admin/selectors/postsSelectors';
import {
    selectTotalContacts,
    selectContactStatsLoading,
} from '@store/admin/selectors/contactsSelectors';

export default function Dashboard() {
    const dispatch = useDispatch();
    const { user, permissions } = useAuth();

    // Stats selectors
    const totalPosts = useSelector(selectTotalPosts);
    const isPostsStatsLoading = useSelector(selectPostStatsLoading);
    const totalContacts = useSelector(selectTotalContacts);
    const isContactStatsLoading = useSelector(selectContactStatsLoading);

    // Permisos
    const canViewPostStats = permissions.includes('stats.posts');
    const canViewContactStats = permissions.includes('stats.contacts');

    useEffect(() => {
        // Fetch stats basado en permisos
        if (canViewPostStats) {
            dispatch(countPosts());
        }
        if (canViewContactStats) {
            dispatch(countContacts());
        }
    }, [dispatch, canViewPostStats, canViewContactStats]);

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
                        value={totalContacts}
                        color="green"
                        description="Total de comunicaciones recibidas"
                        isLoading={isContactStatsLoading}
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