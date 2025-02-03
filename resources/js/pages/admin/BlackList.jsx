import React, { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { XMarkIcon } from '@heroicons/react/24/solid';
import {
    Table,
    TableFilters,
    Paper,
    Button
} from '@components/common';
import { formatDateForDisplay } from '@utils/dateUtils';
import { blacklistTableConfig } from '@config/tables/blacklistTable';
import { useAuth, useToast } from '@hooks';
import  BlockIpModal  from '@/features/blacklist/BlockIpModal';

import {
    fetchBlockedIps,
    unblockIp
} from '@store/admin/thunks/blacklistThunks';

import {
    setFilters,
    setSortConfig,
    setCurrentPage,
    setBlockModalState
} from '@store/admin/slices/blacklistSlice';

import {
    selectPaginatedBlockedIps,
    selectBlacklistLoading,
    selectBlacklistError,
    selectBlacklistFilters,
    selectBlacklistSortConfig,
    selectBlacklistPagination,
    selectBlockModalState,
    selectFilteredAndSortedBlockedIps
} from '@store/admin/selectors/blacklistSelectors';

export default function Blacklist() {
    const dispatch = useDispatch();
    const { hasPermission } = useAuth();
    const toast = useToast();

    const permissions = useMemo(() => ({
        viewList: hasPermission('security.view-blocked'),
        block: hasPermission('security.block-ip'),
        unblock: hasPermission('security.unblock-ip')
    }), [hasPermission]);

    // Selectors
    const blockedIps = useSelector(selectPaginatedBlockedIps);
    const isLoading = useSelector(selectBlacklistLoading);
    const error = useSelector(selectBlacklistError);
    const filters = useSelector(selectBlacklistFilters);
    const sortConfig = useSelector(selectBlacklistSortConfig);
    const { currentPage, itemsPerPage } = useSelector(selectBlacklistPagination);
    const blockModal = useSelector(selectBlockModalState);
    const filteredIps = useSelector(selectFilteredAndSortedBlockedIps);

    useEffect(() => {
        if (permissions.viewList) {
            dispatch(fetchBlockedIps());
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFilterChange = (key, value) => {
        dispatch(setFilters({
            ...filters,
            [key]: value
        }));
    };

    const handleSortChange = (field, direction) => {
        dispatch(setSortConfig({ field, direction }));
    };

    const handlePageChange = (page) => {
        dispatch(setCurrentPage(page));
    };

    const handleBlockClick = () => {
        if (permissions.block) {
            dispatch(setBlockModalState({ isOpen: true }));
        } else {
            toast.warning('You don\'t have permission to block IPs');
        }
    };

    const handleUnblockIp = useCallback(async (ip) => {
        if (!permissions.unblock) {
            toast.warning('You don\'t have permission to unblock IPs');
            return;
        }

        try {
            await dispatch(unblockIp(ip)).unwrap();
            toast.success('IP unblocked successfully');
            dispatch(fetchBlockedIps());
        } catch (error) {
            toast.error('Error unblocking IP: ' + error.message);
        }
    }, [permissions.unblock, dispatch, toast]);

    const columns = useMemo(() => [
        {
            key: 'ip',
            header: 'Dirección IP',
            render: (item) => (
                <div className="text-sm font-medium text-gray-900">
                    {item.ip}
                </div>
            ),
        },
        {
            key: 'blocked_at',
            header: 'Fecha de Bloqueo',
            render: (item) => (
                <span className="text-sm text-gray-500">
                    {formatDateForDisplay(item.blocked_at)}
                </span>
            ),
        },
        {
            key: 'expires_at',
            header: 'Expira en',
            render: (item) => (
                <span className="text-sm text-gray-500">
                    {formatDateForDisplay(item.expires_at)}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Acciones',
            render: (item) => (
                permissions.unblock && (
                    <button
                        onClick={() => handleUnblockIp(item.ip)}
                        className="text-red-600 hover:text-red-900"
                        title="Desbloquear IP"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                )
            ),
        },
    ], [permissions, handleUnblockIp]);

    if (!permissions.viewList) {
        return (
            <Paper title="Access Denied" titleLevel="h1">
                <p className="text-gray-500">
                    No tienes permiso para ver esta página.
                </p>
            </Paper>
        );
    }

    return (
        <div className="space-y-6">
            <Paper
                title="Seguridad"
                titleLevel="h1"
                subtitle="Maneja las IPs bloqueadas"
            />

            <Paper contentClassName="space-y-4">
                {permissions.block && (
                    <Button onClick={handleBlockClick}>
                        Bloquear IP
                    </Button>
                )}

                <TableFilters
                    config={blacklistTableConfig}
                    filters={filters}
                    sortConfig={sortConfig}
                    onFilterChange={handleFilterChange}
                    onSortChange={handleSortChange}
                />

                {error && (
                    <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    Error cargando IPs bloqueadas
                                </h3>
                                <div className="mt-2 text-sm text-red-700">
                                    {error}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <Table
                    columns={columns}
                    data={blockedIps}
                    isLoading={isLoading}
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredIps.length / itemsPerPage)}
                    totalItems={filteredIps.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    emptyMessage="No hay IPs bloqueadas"
                    mainColumn="ip"
                />
            </Paper>

            <BlockIpModal
                isOpen={blockModal.isOpen}
                onClose={() => dispatch(setBlockModalState({ isOpen: false }))}
                onSuccess={() => {
                    dispatch(fetchBlockedIps());
                    toast.success('IP bloqueada correctamente');
                }}
            />
        </div>
    );
}