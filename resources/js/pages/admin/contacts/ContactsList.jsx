import React, { useState, useEffect, useMemo } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Table, TableFilters, ConfirmationDialog, StatusDropdown } from '@components/common';
import { ContactModal } from '@features/contact';
import { formatDateForDisplay } from '@utils/dateUtils';
import { useTableFilters } from '@hooks/useTableFilters';
import { adminContactsService } from '@services/api';
import { contactsTableConfig } from '@config/tables/contactsTable';

export default function ContactsList() {
    const [contacts, setContacts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [contactToDelete, setContactToDelete] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(null);
    const itemsPerPage = 10;

    const {
        filteredData: filteredContacts,
        filters,
        sortConfig,
        currentPage,
        setCurrentPage,
        handleFilterChange,
        handleSortChange
    } = useTableFilters(contacts, contactsTableConfig);

    const fetchContacts = async () => {
        setIsLoading(true);
        try {
            const response = await adminContactsService.getAll();
            setContacts(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error al cargar los contactos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleStatusChange = async (contactId, newStatus) => {
        setUpdatingStatus(contactId);
        try {
            await adminContactsService.updateStatus(contactId, newStatus);
            await fetchContacts();
        } catch (error) {
            console.error('Error al actualizar el estado:', error);
        } finally {
            setUpdatingStatus(null);
        }
    };

    const handleCreateClick = () => {
        setSelectedContact(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (contact) => {
        setSelectedContact(contact);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (contact) => {
        setContactToDelete(contact);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!contactToDelete) return;

        try {
            await adminContactsService.delete(contactToDelete.id);
            await fetchContacts();
            setIsDeleteDialogOpen(false);
            setContactToDelete(null);
        } catch (error) {
            console.error('Error al eliminar el contacto:', error);
        }
    };

    const columns = [
        {
            key: 'contact_info',
            header: 'Información de contacto',
            render: (contact) => (
                <div>
                    <div className="text-sm font-medium text-gray-900">{contact.full_name}</div>
                    <div className="text-sm text-gray-500">{contact.email}</div>
                    {contact.phone && <div className="text-sm text-gray-500">{contact.phone}</div>}
                </div>
            )
        },
        {
            key: 'subject_message',
            header: 'Asunto y mensaje',
            render: (contact) => (
                <div>
                    <div className="text-sm font-medium text-gray-900">{contact.subject}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                        {contact.message}
                    </div>
                </div>
            )
        },
        {
            key: 'status',
            header: 'Estado',
            render: (contact) => (
                <StatusDropdown
                    item={contact}
                    onStatusChange={handleStatusChange}
                    isUpdating={updatingStatus}
                />
            )
        },
        {
            key: 'created_at',
            header: 'Fecha de contacto',
            render: (contact) => (
                <span className="text-sm text-gray-500">
                    {formatDateForDisplay(contact.created_at)}
                </span>
            )
        },
        {
            key: 'actions',
            header: 'Acciones',
            className: 'text-right',
            cellClassName: 'text-right',
            render: (contact) => (
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={() => handleEditClick(contact)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Ver/Editar"
                    >
                        <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => handleDeleteClick(contact)}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
            )
        }
    ];

    const paginatedContacts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredContacts.slice(start, start + itemsPerPage);
    }, [filteredContacts, currentPage]);

    return (
        <div className="space-y-6">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Mensajes de Contacto</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Gestión de consultas y mensajes recibidos
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <button
                        onClick={handleCreateClick}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Crear Contacto
                    </button>
                </div>
            </div>

            <TableFilters
                config={contactsTableConfig}
                filters={filters}
                sortConfig={sortConfig}
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
            />

            <Table
                columns={columns}
                data={paginatedContacts}
                isLoading={isLoading}
                currentPage={currentPage}
                totalPages={Math.ceil(filteredContacts.length / itemsPerPage)}
                totalItems={filteredContacts.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                emptyMessage="No hay mensajes de contacto"
            />

            <ContactModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedContact(null);
                }}
                contact={selectedContact}
                onSuccess={fetchContacts}
            />

            <ConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setContactToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                title="Confirmar eliminación"
                message={`¿Estás seguro de que quieres eliminar el mensaje de ${contactToDelete?.full_name}?`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                confirmButtonStyle="danger"
            />
        </div>
    );
}