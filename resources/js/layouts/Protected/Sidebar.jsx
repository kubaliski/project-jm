import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks';
import {
    Bars3Icon,
    XMarkIcon,
    HomeIcon,
    DocumentTextIcon,
    ChatBubbleBottomCenterIcon,
    UserGroupIcon,
    DocumentCheckIcon,
    ChevronDownIcon,
    ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ onExpandChange }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isPinned, setIsPinned] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const APP_NAME = window.APP_NAME || 'Mi Sitio';

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const navItems = [
        {
            group: 'General',
            items: [
                {
                    path: '/admin',
                    label: 'Dashboard',
                    icon: HomeIcon,
                    permissions: []
                },
                {
                    path: '/admin/posts',
                    label: 'Posts',
                    icon: DocumentTextIcon,
                    permissions: ['post.index']
                },
                {
                    path: '/admin/contacts',
                    label: 'Comunicaciones',
                    icon: ChatBubbleBottomCenterIcon,
                    permissions: ['contact.index']
                }
            ]
        },
        {
            group: 'Gestión',
            items: [
                {
                    path: '/admin/users',
                    label: 'Usuarios',
                    icon: UserGroupIcon,
                    permissions: ['user.index']
                },
                {
                    path: '/admin/roles',
                    label: 'Roles',
                    icon: DocumentCheckIcon,
                    permissions: ['role.index']
                }
            ]
        }
    ];

    const [expandedGroups, setExpandedGroups] = useState(() => {
        const initialState = {};
        navItems.forEach(group => {
            initialState[group.group] = true;
        });
        return initialState;
    });

    const isExpanded = isPinned || isHovered;

    useEffect(() => {
        onExpandChange?.(isExpanded);
    }, [isExpanded, onExpandChange]);

    const toggleGroup = (group) => {
        if (isExpanded) {
            setExpandedGroups(prev => ({
                ...prev,
                [group]: !prev[group]
            }));
        }
    };

    return (
        <div
            onMouseEnter={() => !isPinned && setIsHovered(true)}
            onMouseLeave={() => !isPinned && setIsHovered(false)}
            className={`fixed inset-y-0 left-0 bg-gray-900 transition-all duration-300 z-10 ${
                isExpanded ? 'w-64' : 'w-20'
            }`}
        >
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center h-16 px-4 bg-gray-800">
                    <div className={`transition-all duration-300 overflow-hidden ${
                        isExpanded ? 'w-40 opacity-100' : 'w-0 opacity-0'
                    }`}>
                        <h1 className="text-xl font-bold text-white whitespace-nowrap">{APP_NAME}</h1>
                    </div>
                    <button
                        onClick={() => setIsPinned(!isPinned)}
                        className={`p-1 text-gray-300 hover:text-white transition-colors ${
                            !isExpanded ? 'mx-auto' : 'ml-auto'
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
                    {navItems.map((group) => (
                        <div key={group.group} className="border-b border-gray-700 pb-2">
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
                                            expandedGroups[group.group] ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>
                            )}

                            <div className={`mt-1 space-y-1 transition-all duration-200 ${
                                !isExpanded || expandedGroups[group.group] ? 'block' : 'hidden'
                            }`}>
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.path ||
                                        (item.path !== '/admin' && location.pathname.startsWith(item.path));

                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                                                isActive
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                            } ${!isExpanded ? 'justify-center' : ''}`}
                                            title={!isExpanded ? item.label : ''}
                                        >
                                            <Icon className={`w-6 h-6 transition-all duration-200 ${
                                                isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                                            }`} />
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
                        onClick={handleLogout}
                        className={`w-full flex items-center px-3 py-4 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
                            !isExpanded ? 'justify-center' : ''
                        }`}
                        title={!isExpanded ? 'Cerrar Sesión' : ''}
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

export default Sidebar;