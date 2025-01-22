import React from "react";
import PropTypes from "prop-types";

export const FormLabel = ({ htmlFor, children, required }) => {
    return (
        <label
            htmlFor={htmlFor}
            className="block text-sm font-medium text-gray-700"
        >
            {children}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
    );
};

FormLabel.propTypes = {
    htmlFor: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    required: PropTypes.bool,
};

export const FormInput = ({
    id,
    name,
    type = "text",
    value,
    onChange,
    error,
    label,
    required = false,
    readOnly = false,
    disabled = false,
    placeholder = "",
    rows = 3,
    className = "",
}) => {
    const baseInputStyles = `mt-1 block w-full rounded-md shadow-sm py-2 px-3 sm:text-sm
    ${
        error
            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
            : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
    } ${readOnly ? "bg-gray-50" : ""}
    ${className}`;

    const InputComponent = type === "textarea" ? "textarea" : "input";

    return (
        <div>
            {label && (
                <FormLabel htmlFor={id} required={required}>
                    {label}
                </FormLabel>
            )}

            <InputComponent
                id={id}
                name={name}
                type={type === "textarea" ? undefined : type}
                value={value}
                onChange={onChange}
                readOnly={readOnly}
                disabled={disabled}
                required={required}
                placeholder={placeholder}
                rows={type === "textarea" ? rows : undefined}
                className={baseInputStyles}
            />

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

FormInput.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf([
        "text",
        "email",
        "password",
        "tel",
        "number",
        "textarea",
        "date",
    ]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    label: PropTypes.string,
    required: PropTypes.bool,
    readOnly: PropTypes.bool,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    rows: PropTypes.number,
    className: PropTypes.string,
};

export const FormSelect = ({
    id,
    name,
    value,
    onChange,
    options,
    label,
    error,
    required = false,
    disabled = false,
    readOnly = false,
    className = "",
}) => {
    const baseSelectStyles = `mt-1 block w-full rounded-md shadow-sm py-2 px-3 sm:text-sm
    border-gray-300 focus:ring-indigo-500 focus:border-indigo-500
    ${readOnly ? "bg-gray-50" : ""}
    ${className}`;

    return (
        <div>
            {label && (
                <FormLabel htmlFor={id} required={required}>
                    {label}
                </FormLabel>
            )}

            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled || readOnly}
                className={baseSelectStyles}
                required={required}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

FormSelect.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    label: PropTypes.string,
    error: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    className: PropTypes.string,
};
