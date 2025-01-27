import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth, useToast } from "@hooks";
import { StatCard, Paper } from "@components/common";
import  BlacklistStats  from "@features/blacklist/BlacklistStats";
import { countPosts } from "@store/admin/thunks/postsThunks";
import { fetchBlacklistStats } from "@store/admin/thunks/blacklistThunks";
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


    const canViewStats = {
        posts: hasPermission("stats.posts"),
        contacts: hasPermission("stats.contacts"),
        security: hasPermission("security.view-blocked")

    };

    useEffect(() => {
        let loadingTimeout;
        if (
            (canViewStats.posts && isPostsStatsLoading) ||
            (canViewStats.contacts && isContactStatsLoading)
        ) {
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
    }, [isPostsStatsLoading, isContactStatsLoading]);

    // Modificamos este efecto para que solo se ejecute una vez
    useEffect(() => {
        const loadStats = async () => {
            try {
                const loadPromises = [];
                if (canViewStats.posts) {
                    loadPromises.push(dispatch(countPosts()).unwrap());
                }
                if (canViewStats.contacts) {
                    loadPromises.push(dispatch(countContacts()).unwrap());
                }
                if (canViewStats.security) {
                    loadPromises.push(dispatch(fetchBlacklistStats()).unwrap());
                }
                await Promise.all(loadPromises);
            } catch (error) {
                toast.error(
                    "Error al cargar las estadísticas: " + error.message
                );
            }
        };
        loadStats();
    }, []); // Solo se ejecuta al montar el componente

    const fullName = user ? `${user.name} ${user.last_name}`.trim() : "";

    return (
        <div className="space-y-6">
            <Paper
                title={`Bienvenido, ${fullName}`}
                titleLevel="h1"
                subtitle="Este es tu panel de administración"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {canViewStats.posts && (
                    <StatCard
                        title="Posts"
                        value={totalPosts}
                        color="indigo"
                        description="Total de posts publicados"
                        isLoading={isStatsLoading}
                    />
                )}
                {canViewStats.contacts && (
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
                {canViewStats.security ? (
                    <BlacklistStats />
                ) : (
                    <p className="py-4 text-gray-500 text-sm">
                        No hay actividad reciente
                    </p>
                )}
            </Paper>
        </div>
    );
}