import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@hooks";
import {
    Bars3Icon,
    XMarkIcon,
    ChevronDownIcon,
    ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { navItems } from "@config/data/navItems";

const Sidebar = ({ onExpandChange, onLogout }) => {
    const location = useLocation();
    const { hasPermission } = useAuth();
    const [isPinned, setIsPinned] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const APP_NAME = window.APP_NAME || "Mi Sitio";

    const [expandedGroups, setExpandedGroups] = useState(() => {
        const initialState = {};
        navItems.forEach((group) => {
            initialState[group.group] = true;
        });
        return initialState;
    });

    // Filtra los items basándose en los permisos
    const filteredNavItems = navItems.map(group => ({
        ...group,
        items: group.items.filter(item =>
            // Si no hay permisos requeridos o si tiene todos los permisos necesarios
            !item.permissions.length || item.permissions.every(permission => hasPermission(permission))
        )
    })).filter(group => group.items.length > 0);

    const isExpanded = isPinned || isHovered;

    useEffect(() => {
        onExpandChange?.(isExpanded);
    }, [isExpanded, onExpandChange]);

    const toggleGroup = (group) => {
        if (isExpanded) {
            setExpandedGroups((prev) => ({
                ...prev,
                [group]: !prev[group],
            }));
        }
    };

    return (
        <div
            onMouseEnter={() => !isPinned && setIsHovered(true)}
            onMouseLeave={() => !isPinned && setIsHovered(false)}
            className={`fixed inset-y-0 left-0 bg-gray-900 transition-all duration-300 z-10 ${
                isExpanded ? "w-64" : "w-20"
            }`}
        >
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center h-16 px-4 bg-gray-800">
                    <div
                        className={`transition-all duration-300 overflow-hidden ${
                            isExpanded ? "w-40 opacity-100" : "w-0 opacity-0"
                        }`}
                    >
                        <h1 className="text-xl font-bold text-white whitespace-nowrap">
                            {APP_NAME}
                        </h1>
                    </div>
                    <button
                        onClick={() => setIsPinned(!isPinned)}
                        className={`p-1 text-gray-300 hover:text-white transition-colors ${
                            !isExpanded ? "mx-auto" : "ml-auto"
                        }`}
                    >
                        {isPinned ? (
                            <XMarkIcon className="w-6 h-6" />
                        ) : (
                            <Bars3Icon className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
                    {filteredNavItems.map((group) => (
                        <div
                            key={group.group}
                            className="border-b border-gray-700 pb-2"
                        >
                            {isExpanded && (
                                <button
                                    onClick={() => toggleGroup(group.group)}
                                    className="w-full flex items-center px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md transition-colors justify-between"
                                >
                                    <span className="text-xs font-semibold uppercase tracking-wider">
                                        {group.group}
                                    </span>
                                    <ChevronDownIcon
                                        className={`w-4 h-4 transition-transform duration-200 ${
                                            expandedGroups[group.group]
                                                ? "rotate-180"
                                                : ""
                                        }`}
                                    />
                                </button>
                            )}

                            <div
                                className={`mt-1 space-y-1 transition-all duration-200 ${
                                    !isExpanded || expandedGroups[group.group]
                                        ? "block"
                                        : "hidden"
                                }`}
                            >
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive =
                                        location.pathname === item.path ||
                                        (item.path !== "/admin" &&
                                            location.pathname.startsWith(
                                                item.path
                                            ));

                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                                                isActive
                                                    ? "bg-blue-600 text-white"
                                                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                            } ${
                                                !isExpanded
                                                    ? "justify-center"
                                                    : ""
                                            }`}
                                            title={
                                                !isExpanded ? item.label : ""
                                            }
                                        >
                                            <Icon
                                                className={`w-6 h-6 transition-all duration-200 ${
                                                    isActive
                                                        ? "text-white"
                                                        : "text-gray-400 group-hover:text-white"
                                                }`}
                                            />
                                            {isExpanded && (
                                                <span className="ml-3 whitespace-nowrap">
                                                    {item.label}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Logout Section */}
                <div className="border-t border-gray-700 mt-auto">
                    <button
                            onClick={onLogout}
                            className={`w-full flex items-center px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
                                !isExpanded ? "justify-center" : ""
                            }`}
                            title={!isExpanded ? "Cerrar Sesión" : ""}
                        >
                        <ArrowLeftOnRectangleIcon className="w-6 h-6 text-gray-400" />
                        {isExpanded && (
                            <span className="ml-3">Cerrar Sesión</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

Sidebar.propTypes = {
    onExpandChange: PropTypes.func,
    onLogout: PropTypes.func.isRequired,
};

export default Sidebar;