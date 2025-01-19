import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/solid";
import {
    Table,
    TableFilters,
    ConfirmationDialog,
    StatusDropdown,
    Paper,
    Button,
} from "@components/common";
import { ContactModal } from "@features/contact";
import { formatDateForDisplay } from "@utils/dateUtils";
import { contactsTableConfig } from "@config/tables/contactsTable";
import { useAuth, useToast } from "@hooks";

// Importar thunks y actions...
import {
    fetchContacts,
    updateContactStatus,
    deleteContact,
    countContacts,
} from "@store/admin/thunks/contactsThunks";

import {
    setFilters,
    setSortConfig,
    setCurrentPage,
    setSelectedContact,
    setEditModalState,
    setDeleteModalState,
} from "@store/admin/slices/contactsSlice";

// Importar selectores...
import {
    selectPaginatedContacts,
    selectContactsLoading,
    selectContactsError,
    selectContactsFilters,
    selectContactsSortConfig,
    selectContactsPagination,
    selectSelectedContact,
    selectEditModalState,
    selectDeleteModalState,
    selectFilteredAndSortedContacts,
    selectTotalContacts,
    selectContactStatsLoading,
} from "@store/admin/selectors/contactsSelectors";

export default function ContactsList() {
    const dispatch = useDispatch();
    const { hasPermission } = useAuth();
    const toast = useToast();

    // Permisos específicos
    const canViewList = hasPermission("contact.index");
    const canCreate = hasPermission("contact.create");
    const canEdit = hasPermission("contact.edit");
    const canDelete = hasPermission("contact.delete");
    const canView = hasPermission("contact.view");
    const canUpdateStatus = hasPermission("contact.update-status");
    const canViewStats = hasPermission("stats.contacts");

    // Selectors
    const contacts = useSelector(selectPaginatedContacts);
    const isLoading = useSelector(selectContactsLoading);
    const error = useSelector(selectContactsError);
    const filters = useSelector(selectContactsFilters);
    const sortConfig = useSelector(selectContactsSortConfig);
    const { currentPage, itemsPerPage } = useSelector(selectContactsPagination);
    const editModal = useSelector(selectEditModalState);
    const deleteModal = useSelector(selectDeleteModalState);
    const filteredContacts = useSelector(selectFilteredAndSortedContacts);
    const selectedContact = useSelector(selectSelectedContact);
    const totalContacts = useSelector(selectTotalContacts);
    const isStatsLoading = useSelector(selectContactStatsLoading);

    // Initial data fetch
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                if (canViewList) {
                    await dispatch(fetchContacts()).unwrap();
                }
                if (canViewStats) {
                    await dispatch(countContacts()).unwrap();
                }
            } catch (error) {
                toast.error("Error al cargar los datos: " + error.message);
            }
        };

        fetchInitialData();
    }, [dispatch, canViewList, canViewStats]);

    // Event Handlers
    const handleFilterChange = (key, value) => {
        dispatch(
            setFilters({
                ...filters,
                [key]: value,
            })
        );
    };

    const handleSortChange = (field, direction) => {
        dispatch(setSortConfig({ field, direction }));
    };

    const handlePageChange = (page) => {
        dispatch(setCurrentPage(page));
    };

    const handleStatusChange = async (contactId, newStatus) => {
        if (canUpdateStatus) {
            try {
                await dispatch(
                    updateContactStatus({ id: contactId, status: newStatus })
                ).unwrap();
                toast.success("Estado actualizado correctamente");
            } catch (error) {
                toast.error("Error al actualizar el estado: " + error.message);
            }
        }
    };


    const handleCreateClick = () => {
        if (canCreate) {
            dispatch(setSelectedContact(null));
            dispatch(setEditModalState({ isOpen: true, mode: "create" }));
        } else {
            toast.warning("No tienes permisos para crear contactos");
        }
    };

    const handleEditClick = (contact) => {
        if (canEdit || (canView && !canEdit)) {
            dispatch(setSelectedContact(contact));
            dispatch(
                setEditModalState({
                    isOpen: true,
                    mode: canEdit ? "edit" : "view",
                })
            );
        } else {
            toast.warning("No tienes permisos para ver/editar contactos");
        }
    };


    const handleDeleteClick = (contact) => {
        if (canDelete) {
            dispatch(setSelectedContact(contact));
            dispatch(setDeleteModalState({ isOpen: true }));
        } else {
            toast.warning("No tienes permisos para eliminar contactos");
        }
    };

    const handleConfirmDelete = async () => {
        if (canDelete && selectedContact) {
            try {
                await dispatch(deleteContact(selectedContact.id)).unwrap();
                toast.success(`El mensaje de ${selectedContact.full_name} ha sido eliminado`);

                dispatch(setDeleteModalState({ isOpen: false }));
                dispatch(setSelectedContact(null));

                if (canViewStats) {
                    await dispatch(countContacts()).unwrap();
                }
            } catch (error) {
                toast.error("Error al eliminar el contacto: " + error.message);
            }
        }
    };

    const handleModalSuccess = async (action) => {
        try {
            await dispatch(fetchContacts()).unwrap();
            if (canViewStats) {
                await dispatch(countContacts()).unwrap();
            }
            toast.success(
                action === 'create'
                    ? "Mensaje creado correctamente"
                    : "Mensaje actualizado correctamente"
            );
        } catch (error) {
            toast.error("Error al actualizar la lista: " + error.message);
        }
    };

    const columns = [
        {
            key: "contact_info",
            header: "Información de contacto",
            render: (contact) => (
                <div>
                    <div className="text-sm font-medium text-gray-900">
                        {contact.full_name}
                    </div>
                    <div className="text-sm text-gray-500">{contact.email}</div>
                    {contact.phone && (
                        <div className="text-sm text-gray-500">
                            {contact.phone}
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: "subject_message",
            header: "Asunto y mensaje",
            render: (contact) => (
                <div>
                    <div className="text-sm font-medium text-gray-900">
                        {contact.subject}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                        {contact.message}
                    </div>
                </div>
            ),
        },
        {
            key: "status",
            header: "Estado",
            render: (contact) => (
                <StatusDropdown
                    item={contact}
                    onStatusChange={handleStatusChange}
                    isUpdating={isLoading}
                    viewOnly={!canUpdateStatus}
                />
            ),
        },
        {
            key: "created_at",
            header: "Fecha de contacto",
            render: (contact) => (
                <span className="text-sm text-gray-500">
                    {formatDateForDisplay(contact.created_at)}
                </span>
            ),
        },
        {
            key: "actions",
            header: "Acciones",
            className: "text-right",
            cellClassName: "text-right",
            render: (contact) => (
                <div className="flex justify-end space-x-3">
                    {(canView || canEdit) && (
                        <button
                            onClick={() => handleEditClick(contact)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                            title={canEdit ? "Editar" : "Ver"}
                        >
                            {canEdit ? (
                                <PencilIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                    )}
                    {canDelete && (
                        <button
                            onClick={() => handleDeleteClick(contact)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar"
                        >
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    )}
                </div>
            ),
        },
    ];

    // Si no tiene permiso para ver la lista, mostrar mensaje o redireccionar
    if (!canViewList) {
        return (
            <Paper title="Acceso denegado" titleLevel="h1">
                <p className="text-gray-500">
                    No tienes permisos para ver esta sección.
                </p>
            </Paper>
        );
    }

    return (
        <div className="space-y-6">
            <Paper
                title="Mensaje de Contacto"
                titleLevel="h1"
                subtitle="Gestión de consultas y mensajes recibidos"
                contentClassName="sm:flex sm:items-center sm:justify-between"
            >
                <div>
                    {canViewStats && !isStatsLoading && (
                        <p className="mt-1 text-sm text-gray-500">
                            Total de mensajes: {totalContacts}
                        </p>
                    )}
                </div>
            </Paper>
            <Paper contentClassName="space-y-4">
                {canCreate && (
                    <Button onClick={handleCreateClick}>Nuevo mensaje</Button>
                )}
                <TableFilters
                    config={contactsTableConfig}
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
                                    Error al cargar los contactos
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
                    data={contacts}
                    isLoading={isLoading}
                    currentPage={currentPage}
                    totalPages={Math.ceil(
                        filteredContacts.length / itemsPerPage
                    )}
                    totalItems={filteredContacts.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    emptyMessage="No hay mensajes de contacto"
                />
            </Paper>
            <ContactModal
                isOpen={editModal.isOpen}
                mode={editModal.mode}
                onClose={() => {
                    dispatch(setEditModalState({ isOpen: false, mode: null }));
                    dispatch(setSelectedContact(null));
                }}
                onSuccess={() => handleModalSuccess(editModal.mode)}
                readOnly={selectedContact && !canEdit}
            />

            <ConfirmationDialog
                isOpen={deleteModal.isOpen}
                onClose={() => {
                    dispatch(setDeleteModalState({ isOpen: false }));
                    dispatch(setSelectedContact(null));
                }}
                onConfirm={handleConfirmDelete}
                title="Confirmar eliminación"
                message={`¿Estás seguro de que quieres eliminar el mensaje de ${selectedContact?.full_name}?`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                confirmButtonStyle="danger"
            />
        </div>
    );
}
