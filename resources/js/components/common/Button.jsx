import React from "react";
import PropTypes from "prop-types";

const Button = ({ children, onClick, className = "", type = "button" }) => {
    const baseStyles =
        "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

    // Combina los estilos base con los personalizados si se proporcionan
    const buttonStyles = className ? className : baseStyles;

    return (
        <button type={type} onClick={onClick} className={buttonStyles}>
            {children}
        </button>
    );
};

export default Button;

Button.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    type: PropTypes.string,
};
