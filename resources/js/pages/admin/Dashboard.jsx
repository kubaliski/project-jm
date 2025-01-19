import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth, useToast } from "@hooks";
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
    const toast = useToast();
    const { user, hasPermission } = useAuth();

    const totalPosts = useSelector(selectTotalPosts);
    const totalContacts = useSelector(selectTotalContacts);
    const isPostsStatsLoading = useSelector(selectPostStatsLoading);
    const isContactStatsLoading = useSelector(selectContactStatsLoading);

    const [isStatsLoading, setIsStatsLoading] = useState(false);

    const canViewPostStats = hasPermission("stats.posts");
    const canViewContactStats = hasPermission("stats.contacts");

    useEffect(() => {
        let loadingTimeout;

        if ((canViewPostStats && isPostsStatsLoading) ||
            (canViewContactStats && isContactStatsLoading)) {
            setIsStatsLoading(true);
            return;
        }

        if (!isPostsStatsLoading && !isContactStatsLoading) {
            loadingTimeout = setTimeout(() => {
                setIsStatsLoading(false);
            }, 500);
        }

        return () => {
            if (loadingTimeout) {
                clearTimeout(loadingTimeout);
            }
        };
    }, [isPostsStatsLoading, isContactStatsLoading, canViewPostStats, canViewContactStats]);

    useEffect(() => {
        const loadStats = async () => {
            try {
                if (canViewPostStats) {
                    await dispatch(countPosts()).unwrap();
                }
                if (canViewContactStats) {
                    await dispatch(countContacts()).unwrap();
                }
            } catch (error) {
                toast.error("Error al cargar las estadísticas: " + error.message);
            }
        };

        loadStats();
    }, [dispatch, canViewPostStats, canViewContactStats]);

    const fullName = user ? `${user.name} ${user.last_name}`.trim() : "";

    return (
        <div className="space-y-6">
            <Paper
                title={`Bienvenido, ${fullName}`}
                titleLevel="h1"
                subtitle="Este es tu panel de administración"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {canViewPostStats && (
                    <StatCard
                        title="Posts"
                        value={totalPosts}
                        color="indigo"
                        description="Total de posts publicados"
                        isLoading={isStatsLoading}
                    />
                )}
                {canViewContactStats && (
                    <StatCard
                        title="Comunicaciones"
                        value={totalContacts}
                        color="red"
                        description="Total de comunicaciones recibidas"
                        isLoading={isStatsLoading}
                    />
                )}
            </div>
            <Paper title="Actividad reciente" titleLevel="h2">
                <p className="py-4 text-gray-500 text-sm">
                    No hay actividad reciente
                </p>
            </Paper>
        </div>
    );
}