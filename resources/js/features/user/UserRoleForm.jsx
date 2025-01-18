// UserRoleForm.jsx
import React from 'react';
import PropTypes from 'prop-types';

const UserRoleForm = ({
    selectedRole,
    availableRoles = [],
    onRoleChange,
    isSubmitting = false,
    errors = {},
    readOnly = false
}) => {
    // No necesitamos estado local ya que todo viene por props
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">
                {readOnly ? 'Rol asignado' : 'Seleccionar rol'}
            </h3>
            <div className="mt-2 space-y-2">
                {availableRoles.map(role => (
                    <div key={role.id} className="relative flex items-start py-2">
                        <div className="flex items-center h-5">
                            <input
                                type="radio"
                                id={`role-${role.id}`}
                                name="role"
                                value={role.id}
                                checked={selectedRole === role.id}
                                onChange={() => !readOnly && onRoleChange(role.id)}
                                disabled={isSubmitting || readOnly}
                                className={`h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500
                                    ${readOnly ? 'cursor-not-allowed opacity-50' : ''}`}
                            />
                        </div>
                        <div className="ml-3">
                            <label
                                htmlFor={`role-${role.id}`}
                                className={`text-sm font-medium text-gray-700 capitalize
                                    ${readOnly ? 'cursor-not-allowed' : ''}`}
                            >
                                {role.name}
                            </label>
                            {role.description && (
                                <p className="text-xs text-gray-500">{role.description}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role}</p>
            )}
        </div>
    );
};

UserRoleForm.propTypes = {
    selectedRole: PropTypes.number,
    availableRoles: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string
    })),
    onRoleChange: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool,
    errors: PropTypes.object,
    readOnly: PropTypes.bool
};

export default UserRoleForm;