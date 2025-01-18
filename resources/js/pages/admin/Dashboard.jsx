import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@hooks";
import { StatCard, Paper } from "@components/common";
import { countPosts } from "@store/admin/thunks/postsThunks";
import { countContacts } from "@store/admin/thunks/contactsThunks";
import {
    selectTotalPosts,
    selectPostStatsLoading,
} from "@store/admin/selectors/postsSelectors";
import {
    selectTotalContacts,
    selectContactStatsLoading,
} from "@store/admin/selectors/contactsSelectors";

export default function Dashboard() {
    const dispatch = useDispatch();
    const { user, permissions } = useAuth();

    const totalPosts = useSelector(selectTotalPosts);
    const isPostsStatsLoading = useSelector(selectPostStatsLoading);
    const totalContacts = useSelector(selectTotalContacts);
    const isContactStatsLoading = useSelector(selectContactStatsLoading);

    const canViewPostStats = permissions.includes("stats.posts");
    const canViewContactStats = permissions.includes("stats.contacts");

    useEffect(() => {
        if (canViewPostStats) {
            dispatch(countPosts());
        }
        if (canViewContactStats) {
            dispatch(countContacts());
        }
    }, [dispatch, canViewPostStats, canViewContactStats]);

    const fullName = user ? `${user.name} ${user.last_name}`.trim() : "";

    return (
        <div className="space-y-6">
            {/* Cabecera de bienvenida */}
            <Paper
                title={`Bienvenido, ${fullName}`}
                titleLevel="h1"
                subtitle="Este es tu panel de administración"
            ></Paper>

            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {canViewPostStats && (
                    <StatCard
                        title="Posts"
                        value={totalPosts}
                        color="indigo"
                        description="Total de posts publicados"
                        isLoading={isContactStatsLoading}
                    />
                )}
                {canViewContactStats && (
                    <StatCard
                        title="Comunicaciones"
                        value={totalContacts}
                        color="red"
                        description="Total de comunicaciones recibidas"
                        isLoading={isContactStatsLoading}
                    />
                )}
            </div>

            {/* Actividad reciente */}
            <Paper title="Actividad reciente" titleLevel="h2">
                <p className="py-4 text-gray-500 text-sm">
                    No hay actividad reciente
                </p>
            </Paper>
        </div>
    );
}
