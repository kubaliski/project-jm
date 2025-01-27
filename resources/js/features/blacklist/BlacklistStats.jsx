import React from 'react';
import { useSelector } from 'react-redux';
import { selectBlacklistStats, selectBlacklistStatsLoading } from '@store/admin/selectors/blacklistSelectors';

export default function BlacklistStats() {
    const stats = useSelector(selectBlacklistStats);
    const isLoading = useSelector(selectBlacklistStatsLoading);

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
        );
    }

    const statItems = [
        {
            label: 'Bloqueados Actualmente',
            value: stats.currently_blocked,
            className: 'text-red-600'
        },
        {
            label: 'Desbloqueados Manualmente',
            value: stats.manually_unblocked,
            className: 'text-green-600'
        },
        {
            label: 'Bloqueos que expiraron',
            value: stats.expired,
            className: 'text-gray-600'
        },
        {
            label: 'Ips unicas bloqueadas',
            value: stats.total_unique,
            className: 'text-blue-600'
        },
        {
            label: 'Reincidentes',
            value: stats.repeat_offenders,
            className: 'text-yellow-600'
        }
    ];

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Estadisticas de seguridad</h3>

            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {statItems.map((item) => (
                    <div
                        key={item.label}
                        className="relative overflow-hidden rounded-lg bg-white px-4 py-5 border border-gray-200"
                    >
                        <dt className="truncate text-sm font-medium text-gray-500">
                            {item.label}
                        </dt>
                        <dd className={`mt-1 text-3xl font-semibold tracking-tight ${item.className}`}>
                            {item.value}
                        </dd>
                    </div>
                ))}
            </dl>

            <div className="mt-4 text-sm text-gray-500">
                Total de bloqueos: {stats.total_blocks}
            </div>
        </div>
    );
}